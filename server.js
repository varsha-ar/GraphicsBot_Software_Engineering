require('dotenv').config()
const { ManagedIdentityCredential, AzureCliCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const axios = require('axios')
const path = require('path');
const cookieSession = require('cookie-session')
const express = require('express'); //Line 1
const sampleData = require('./sampleData/sampledata');
const blobService = require('./blobServiceV2');

const create = async () => {
	const app = express(); //Line 2
	app.use(express.json());
	const credential = process.env.ENVIRONMENT != 'local' ? new ManagedIdentityCredential() : new AzureCliCredential();
	const client = new SecretClient(`https://${process.env.AZURE_KEY_VAULT_NAME}.vault.azure.net/`, credential);
	const latestSecret = (await client.getSecret('BlobStorageConnectionString')).value;
	const blobSvc = new blobService.BlobService(latestSecret);
	app.use(cookieSession({
		name: 'session',
		keys: ['key1', 'key2'],
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	}))
	const latestGitSecret = (await client.getSecret('GitHubAppSecret')).value;
	const githubAPI = {
		client_id: process.env.REACT_APP_CLIENT_ID,
		client_secret: latestGitSecret
	};

	if (process.env.ENVIRONMENT != 'local')
		app.use(express.static(path.resolve(__dirname, './clientapp/build')));

	// create a GET route
	app.get('/data/bugs', async (req, res) => { //Line 9
		res.send(sampleData.horizontalBarData); //Line 10
	});

	app.get('/data/issues', (req, res) => { //Line 9
		res.send(sampleData.stackedBarData); //Line 10
	});

	app.get('/data/users', (req, res) => { //Line 9
		res.send(sampleData.userData); //Line 10
	});

	app.get('/data/pieData', (req, res) => { //Line 9
		res.send(sampleData.pieChartData); //Line 10
	});

	app.get('/visual', async (req, res) => {
		res.send(await blobSvc.getVisual(req.query.id, req.session.user.id));
	});

	app.get('/snapshot', async (req, res) => {
		res.send(await blobSvc.getSnapshot(req.query.id, req.session.user.id));
	});

	app.post('/visual', async (req, res) => {
		await blobSvc.createVizdata(req.body, req.session.user)
		res.send(req.session.user);
	});

	app.post('/snapshot', async (req, res) => {
		await blobSvc.createSnapdata(req.body, req.session.user)
		res.send(req.session.user);
	});

	app.post('/updatevisual', async (req, res) => {
		res.send(await blobSvc.updateVizData(req.body, req.session.user));
	});

	// app.get('/data/contributor-issues', (req, res) => { //Line 9
	// 	res.send(sampleData.pieChartData); //Line 10
	// });

	app.get('/oauth/token', (req, res) => { //Line 9
		if (req.session.access_token) {
			res.status(200).send(req.session.user);
			return;
		}
		const request = req.query.code

		const { client_id, client_secret } = githubAPI;

		axios({
			method: 'post',
			url: `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${request}`,

			headers: {
				accept: 'application/json'
			}


		}).then((response) => {

			req.session.access_token = response.data.access_token;
			axios({

				method: 'get',
				url: `https://api.github.com/user`,
				headers: {
					Authorization: `Bearer ${req.session.access_token}`
				}

			}).then(async (responses) => {
				req.session.user = await blobSvc.createUser(responses.data.id);
				req.session.login = responses.data.login
				res.status(200).send(req.session.user);
			}).catch((error) => {
				res.status(500).send(error);
			})
		})
	});





	app.get('/data/repos', (req, res) => { //Line 9

		var repo_list = new Array();

		axios({


			method: 'get',
			url: `https://api.github.com/user/repos?visibility=all`,
			headers: {

				accept: 'application/json',
				Authorization: `Bearer ${req.session.access_token}`
			}

		}).then((Response) => {

			var obj = Response.data;
			for (var i = 0; i < obj.length; i++) {
				var name = obj[i].name;
				repo_list.push({ name: name, owner: obj[i].owner.login });
			}

			res.send(repo_list);

		}).catch((error) => {
			res.status(500).send(error);
		})
	});


	app.get('/data/contributor-issues', (req, res) => { //Line 9
		var issueList = new Array();
		const repo = req.query.repo;
		const owner = req.query.owner;
		var count = 0;

		axios({

			method: 'get',
			url: `https://api.github.com/repos/${owner}/${repo}/issues`,
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${req.session.access_token}`
			}

		}).then((Response) => {
			var obj = Response.data;
			let arr = {};
			obj.forEach(element => {
				if (element.assignee?.login)
					if (arr[element.assignee.login]) {
						arr[element.assignee.login] = arr[element.assignee.login] + 1;
					}
					else {
						arr[element.assignee.login] = 1;
					}
			});
			for (var key in arr) {
				issueList.push({ contributor: key, issues: arr[key] });
			}
			// issueList.push({
			// 	contributor: owner,
			// 	issues: count
			// })
			res.send(issueList);
		}).catch((error) => {
			console.log(error);
			res.status(500).send(error);
		})
	});



	app.get('/data/milestone-issues', (req, res) => { //Line 9
		var issueList = [];
		var state = false
		const repo = req.query.repo;
		const owner = req.query.owner;
		axios({

			method: 'get',
			url: `https://api.github.com/repos/${owner}/${repo}/issues?labels=bug&state=all&milestone=*`,
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${req.session.access_token}`
			}

		}).then((Response) => {
			var obj = Response.data;
			for (var i = 0; i < obj.length; i++) {
				const index = issueList.findIndex(element => {
					if (element.name === obj[i].milestone.title) {
						return true;
					}
				});

				if (index != -1) {
					if (obj[i].state === "open") {
						issueList[index].bugsOpen++;
					} else {
						issueList[index].bugsClosed++;
					}

					issueList[index].totalBugs++;

				} else {
					if (obj[i].state === "open") {
						state = true;
					}
					if (state) {
						issueList.push({
							name: obj[i].milestone.title,
							totalBugs: 1,
							bugsOpen: 1,
							bugsClosed: 0
						});
					} else {
						issueList.push({
							name: obj[i].milestone.title,
							totalBugs: 1,
							bugsOpen: 0,
							bugsClosed: 1
						});
					}
				}
			}
			res.send(issueList);
		}).catch((error) => {
			console.log(error);
			res.status(500).send(error);
		})
	});

	app.get('/data/tasks', (req, res) => { //Line 9


		var taskList = [];
		var count = 0;
		const repo = req.query.repo;
		const owner = req.query.owner;
		//console.log("session token", req.session.access_token)
		axios({

			method: 'get',
			url: `https://api.github.com/repos/${owner}/${repo}/issues?state=all&milestone=*`,
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${req.session.access_token}`
			}

		}).then((Response) => {
			var obj = Response.data

			for (var i = 0; i < obj.length; i++) {

				const index = taskList.findIndex(element => {
					if (element.name === obj[i].milestone.title) {
						return true;
					}
				});
				if (index != -1) {
					for (var k = 0; k < obj[i].labels.length; k++) {

						if (obj[i].labels[k].name === "documentation") {
							taskList[index].documentation++;
						} else if (obj[i].labels[k].name === "enhancement") {
							taskList[index].enhancement++;
						} else if (obj[i].labels[k].name === "wontfix") {
							taskList[index].wontfix++;
						} else if (obj[i].labels[k].name === "duplicate") {
							taskList[index].duplicate++;
						}
					}
				} else {
					taskList.push({
						name: obj[i].milestone.title,
						documentation: 0,
						enhancement: 0,
						wontfix: 0,
						duplicate: 0
					});
					for (var k = 0; k < obj[i].labels.length; k++) {

						if (obj[i].labels[k].name === "documentation") {
							taskList[count].documentation++;

						} else if (obj[i].labels[k].name === "enhancement") {
							taskList[count].enhancement++;
						}
						else if (obj[i].labels[k].name === "wontfix") {
							taskList[count].wontfix++;
						} else if (obj[i].labels[k].name === "duplicate") {
							taskList[count].duplicate++;
						}
					}
				}
				count++;
			}
			res.send(taskList);
		}).catch((error) => {
			res.status(500).send(error);
		})
	});



	app.get('/data/contributor-activity', (req, res) => { //Line 9
		var userList = [];
		const repo = req.query.repo;
		const owner = req.query.owner;
		var add = 0, del = 0, count = 0;

		axios({

			method: 'get',
			url: `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${req.session.access_token}`
			}

		}).then((Response) => {
			var obj = Response.data;
			for (var i = 0; i < obj.length; i++) {
				const index = userList.findIndex(element => {
					if (element.name === obj[i].author.login) {
						return true;
					}
				});
				for (var k = 0; k < obj[i].weeks.length; k++) {

					add += obj[i].weeks[k].a;
					del += obj[i].weeks[k].d;
					count = obj[i].weeks[k].length

				}

				userList.push({
					contributor: obj[i].author.login,
					week: count,
					additions: add,
					deletions: del,
					commits: obj[i].total
				});

			}
			res.send(userList);


		}).catch((error) => {
			console.log(error);
			res.status(500).send(error);
		})
	});




	app.get('/data/issuesPerUser', (req, res) => { //Line 9
		var userList = [];
		const repo = req.query.repo;
		const owner = req.session.login;
		var add = 0, del = 0;

		axios({

			method: 'get',
			url: `https://api.github.com/issues`,
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${req.session.access_token}`
			}

		}).then((Response) => {
			var obj = Response.data;
			for (var i = 0; i < obj.length; i++) {
				const index = userList.findIndex(element => {
					if (element.name === obj[i].author.login) {
						return true;
					}
				});
				for (var k = 0; k < obj[i].weeks.length; k++) {

					add += obj[i].weeks[k].a;
					del += obj[i].weeks[k].d;

				}

				userList.push({
					contributor: obj[i].author.login,
					week: obj[i].weeks.length,
					additions: add,
					deletions: del,
					commits: obj[i].total
				});

			}
			res.send(userList);


		}).catch((error) => {
			console.log(error);
			res.status(500).send(error);
		})
	});

	// Issues = 1
	// Pull requests = 2
	app.get('/data/custom-visual', (req, res) => {
		const dimensionX = req.query.dimension;
		const dimensionY = req.query.measure;
		const repo = req.query.repo;
		const owner = req.query.owner;
		switch (req.query.visual) { // Pie Chart
			case '1':
				// Issues
				if (dimensionX === '1') {
					axios({
						method: 'get',
						url: `https://api.github.com/repos/${owner}/${repo}/issues?state=all&milestone=*`,
						headers: {
							accept: 'application/json',
							Authorization: `Bearer ${req.session.access_token}`
						}
					}).then((issueResponse) => {
						const data = issueResponse.data;
						if (dimensionY === '1') { // Issues per milestone
							let resData = {};
							data.map((x) => {
								if (resData[x.milestone.title]) {
									resData[x.milestone.title]++;
								}
								else {
									resData[x.milestone.title] = 1;
								}
							});
							res.send(Object.keys(resData).map((key, index) => ({ contributor: key, issues: resData[key] })));
						}
						else if (dimensionY === '2') {// Issues per label
							let resData = {};
							data.map((x) => {
								x.labels.map(y => {
									if (resData[y.name]) {
										resData[y.name] = resData[y.name] + 1;
									} else {
										resData[y.name] = 1;
									}
								});
							});
							res.send(Object.keys(resData).map((key, index) => ({ contributor: key, issues: resData[key] })));
						}
						else if (dimensionY === '3') {// Issues by status
							let resData = {};
							data.map((x) => {
								if (resData[x.state]) {
									resData[x.state] = resData[x.state] + 1;
								}
								else {
									resData[x.state] = 1;
								}
							});
							res.send(Object.keys(resData).map((key, index) => ({ contributor: key, issues: resData[key] })));
						}
					}).catch((error) => {
						res.status(500).send(error);
					})
				} else if (dimensionX === '2') { // pull requests
					axios({
						method: 'get',
						url: `https://api.github.com/repos/${owner}/${repo}/pulls`,
						headers: {
							accept: 'application/json',
							Authorization: `Bearer ${req.session.access_token}`
						}
					}).then(response => {
						const data = response.data;
						if (dimensionY === '1') { // Pull requests by user
							let resData = {};
							data.map((x) => {
								if (resData[x.user.login]) {
									resData[x.user.login] = resData[x.user.login] + 1;
								} else {
									resData[x.user.login] = 1;
								}
							});
							res.send(Object.keys(resData).map((key, index) => ({ contributor: key, issues: resData[key] })));
						} else if (dimensionY === '2') { // Pull requests by milestone
							let resData = {};
							data.map((x) => {
								if (resData[x.milestone.title]) {
									resData[x.milestone.title] = resData[x.milestone.title] + 1;
								} else {
									resData[x.milestone.title] = 1;
								}
							});
							res.send(Object.keys(resData).map((key, index) => ({ contributor: key, issues: resData[key] })));
						}
					}).catch((error) => {
						res.status(500).send(error);
					})
				}
				else {
					res.status(400).send("Bad Request");
				}
				break;
			case '2': // Bar graph
				// Issues
				if (dimensionX === '1') {
					axios({
						method: 'get',
						url: `https://api.github.com/repos/${owner}/${repo}/issues?state=all&milestone=*`,
						headers: {
							accept: 'application/json',
							Authorization: `Bearer ${req.session.access_token}`
						}
					}).then((issueResponse) => {
						const data = issueResponse.data;
						if (dimensionY === '1') { // Issues per milestone
							let resData = {};
							data.map((x) => {
								if (resData[x.milestone.title]) {
									resData[x.milestone.title]++;
								}
								else {
									resData[x.milestone.title] = 1;
								}
							});
							res.send(Object.keys(resData).map((key, index) => ({ name: key, "Issues": resData[key] })));
						}
						else if (dimensionY === '2') {// Issues per label
							let resData = {};
							data.map((x) => {
								x.labels.map(y => {
									if (resData[y.name]) {
										resData[y.name] = resData[y.name] + 1;
									} else {
										resData[y.name] = 1;
									}
								});
							});
							res.send(Object.keys(resData).map((key, index) => ({ name: key, "Issues": resData[key] })));
						}
						else if (dimensionY === '3') {// Issues by status
							let resData = {};
							data.map((x) => {
								if (resData[x.state]) {
									resData[x.state] = resData[x.state] + 1;
								}
								else {
									resData[x.state] = 1;
								}
							});
							res.send(Object.keys(resData).map((key, index) => ({ name: key, "Issues": resData[key] })));
						}
					}).catch((error) => {
						res.status(500).send(error);
					})
				} else if (dimensionX === '2') { // pull requests
					axios({
						method: 'get',
						url: `https://api.github.com/repos/${owner}/${repo}/pulls`,
						headers: {
							accept: 'application/json',
							Authorization: `Bearer ${req.session.access_token}`
						}
					}).then(response => {
						const data = response.data;
						if (dimensionY === '1') { // Pull requests by user
							let resData = {};
							data.map((x) => {
								if (resData[x.user.login]) {
									resData[x.user.login] = resData[x.user.login] + 1;
								} else {
									resData[x.user.login] = 1;
								}
							});
							res.send(Object.keys(resData).map((key, index) => ({ name: key, "Pull Requests": resData[key] })));
						} else if (dimensionY === '2') { // Pull requests by milestone
							let resData = {};
							data.map((x) => {
								if (resData[x.milestone.title]) {
									resData[x.milestone.title] = resData[x.milestone.title] + 1;
								} else {
									resData[x.milestone.title] = 1;
								}
							});
							res.send(Object.keys(resData).map((key, index) => ({ name: key, "Pull Requests": resData[key] })));
						}
					}).catch((error) => {
						res.status(500).send(error);
					})
				}
				else {
					res.status(400).send("Bad Request");
				} break;
			default:
				res.status(400).send("Bad Request");
				break;
		}
	});

	if (process.env.ENVIRONMENT != 'local')
		app.get('*', (req, res) => {
			res.sendFile(path.resolve(__dirname, './clientapp/build', 'index.html'));
		});

	return app;
}


const port = process.env.PORT || 5000;

create().then(app => {
	app.listen(port, () => {
		console.log(`Server has started on port ${port}!`);
	});
}).catch(err => {
	console.log(err)
});