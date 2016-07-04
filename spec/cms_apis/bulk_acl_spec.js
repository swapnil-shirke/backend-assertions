describe('Bulk sys ACL --- ', function() {

	var api_key, appname, appUid, master_key
	var api_key1, appname1, appUid1, master_key1
	
	var classUid, classUid1, supertest_numClass

	var authtoken, userUID, username, email
	var authtoken_1, userUID_1, username_1
	var authtoken_2, userUID_2, username_2

	var email_1, email_2

	var devRole, contentRole, supertestRole, roleid, devRole1


	before(function(done) {
		this.timeout(25000)

		R.Promisify(factories.create('login_system_user'))
			.then(function(res) {
				authtoken = res.body.user.authtoken;
				userUID   = res.body.user.uid;
				username  = res.body.user.username;
				email     = res.body.user.email;
			})
			.then(function() {
				return R.Promisify(factories.create('Create_application', authtoken))
			})
			.then(function(res) {
				api_key    = res.body.application.api_key;
				master_key = res.body.application.master_key;
				appname    = res.body.application.name;
				appUid     = res.body.application.uid
			})
			.then(function() {
				return R.Promisify(factories.create('Create_class', authtoken, api_key, {
					"class": {
						"title": "supertest class",
						"uid": "supertest_class",
						"maintain_revisions": true,
						"schema": [{
							"multiple": false,
							"mandatory": true,
							"display_name": "Name",
							"uid": "name",
							"data_type": "text"
						}],
						"DEFAULT_ACL": {
							"others": {
								"create": false,
								"read": false
							}
						}
					}
				}))
			})
			.then(function(res) {
				classUid = res.body.class.uid
			})
			.then(function() {
				return R.Promisify(factories.create('login_system_user', config.user2))
			})
			.then(function(res1) {
				authtoken_1 = res1.body.user.authtoken;
				userUID_1 = res1.body.user.uid;
				username_1 = res1.body.user.username;
				email_1 = res1.body.user.email;
			})
			.then(function() {
				return R.Promisify(factories.create('invite_collaborator', authtoken, api_key, {
					"emails": [
						email_1
					]
				}))
			})
			.then(function() {
				return R.Promisify(factories.create('Create_system_role', authtoken, api_key, {
					name: 'Dev manager',
					"description": "Dev manager system role in supertest app"
				}))
			})
			.then(function(res) {
				devRole = res.body.system_role.uid
			})
			.then(function() {
				return R.Promisify(factories.create('Create_system_role', authtoken, api_key, {
					name: 'Content manager',
					"description": "Content manager system role in supertest app"
				}))
			})
			.then(function(res) {
				contentRole = res.body.system_role.uid
			})
			.then(function() {
				return R.Promisify(factories.create('Update_application', authtoken, api_key, {
					"application": {
						"SYS_ACL": {
							"others": {
								"invite": false,
								"sub_acl": {
									"create": false,
									"read": false,
									"update": false,
									"delete": false
								}
							},
							"roles": [{
								"uid": devRole,
								"invite": true,
								"sub_acl": {
									"create": true,
									"read": true,
									"update": true,
									"delete": true
								}
							}]
						}
					}
				}))
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})

	})


	after(function(done) {
		factories.create('Delete_application', authtoken, api_key)
			.end(function(err, res1) {
				// console.log("application delete")
				done(err)
			})

	})


	describe('Classes Bulk sys ACL', function() {

		it('should apply bulk sys ACL on given classes', function(done) {

			factories.create('apply_bulk_sys_acl', authtoken, api_key, {
				"classes": [{
					"uid": "built_io_application_user",
					"SYS_ACL": {
						"roles": [{
							"uid": devRole,
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}, {
							"uid": contentRole,
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}],
						"others": {
							"read": false,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}
				}, {
					"uid": "built_io_application_user_role",
					"SYS_ACL": {
						"roles": [{
							"uid": devRole,
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}, {
							"uid": contentRole,
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}],
						"others": {
							"read": false,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}
				}, {
					"uid": "built_io_installation_data",
					"SYS_ACL": {
						"roles": [{
							"uid": devRole,
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}, {
							"uid": contentRole,
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}],
						"others": {
							"read": false,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}
				}, {
					"uid": "built_io_upload",
					"SYS_ACL": {
						"roles": [{
							"uid": devRole,
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}, {
							"uid": contentRole,
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}],
						"others": {
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}
				}, {
					"uid": classUid,
					"SYS_ACL": {
						"roles": [{
							"uid": contentRole,
							"read": false,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}],
						"others": {
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}
				}]

			})
				.end(function(err, res) {

					var classes1 = res.body.classes[0]
					var classes2 = res.body.classes[1]
					var classes3 = res.body.classes[2]
					var classes4 = res.body.classes[3]
					var classes5 = res.body.classes[4]

					// Keys assertion
					Object.keys(classes1).should.to.be.deep.equal(['uid', 'SYS_ACL'])
					Object.keys(classes2).should.to.be.deep.equal(['uid', 'SYS_ACL'])
					Object.keys(classes3).should.to.be.deep.equal(['uid', 'SYS_ACL'])
					Object.keys(classes4).should.to.be.deep.equal(['uid', 'SYS_ACL'])
					Object.keys(classes5).should.to.be.deep.equal(['uid', 'SYS_ACL'])

					Object.keys(classes1.SYS_ACL).should.to.be.deep.equal(['others', 'roles'])
					Object.keys(classes2.SYS_ACL).should.to.be.deep.equal(['others', 'roles'])
					Object.keys(classes3.SYS_ACL).should.to.be.deep.equal(['others', 'roles'])
					Object.keys(classes4.SYS_ACL).should.to.be.deep.equal(['others', 'roles'])
					Object.keys(classes5.SYS_ACL).should.to.be.deep.equal(['others', 'roles'])

					Object.keys(classes1.SYS_ACL.others).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes2.SYS_ACL.others).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes3.SYS_ACL.others).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes4.SYS_ACL.others).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes5.SYS_ACL.others).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])

					Object.keys(classes1.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes2.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes3.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes4.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes5.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])

					Object.keys(classes1.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes2.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes3.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes4.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])


					Object.keys(classes1.SYS_ACL.others.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes2.SYS_ACL.others.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes3.SYS_ACL.others.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes4.SYS_ACL.others.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes5.SYS_ACL.others.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])

					Object.keys(classes1.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes2.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes3.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes4.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes5.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])

					Object.keys(classes1.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes2.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes3.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes4.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])



					Object.keys(classes1.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes2.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes3.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes4.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes5.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])

					Object.keys(classes1.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes2.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes3.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
					Object.keys(classes4.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])


					Object.keys(classes1.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes2.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes3.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes4.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes5.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])

					Object.keys(classes1.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes2.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes3.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
					Object.keys(classes4.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])


					// Data assertion
					classes1.uid.should.be.a('string')
					classes2.uid.should.be.a('string')
					classes3.uid.should.be.a('string')
					classes4.uid.should.be.a('string')
					classes5.uid.should.be.a('string')

					classes1.SYS_ACL.should.be.a('object')
					classes2.SYS_ACL.should.be.a('object')
					classes3.SYS_ACL.should.be.a('object')
					classes4.SYS_ACL.should.be.a('object')
					classes5.SYS_ACL.should.be.a('object')

					classes1.SYS_ACL.others.should.be.a('object')
					classes2.SYS_ACL.others.should.be.a('object')
					classes3.SYS_ACL.others.should.be.a('object')
					classes4.SYS_ACL.others.should.be.a('object')
					classes5.SYS_ACL.others.should.be.a('object')

					classes1.SYS_ACL.others.sub_acl.should.be.a('object')
					classes2.SYS_ACL.others.sub_acl.should.be.a('object')
					classes3.SYS_ACL.others.sub_acl.should.be.a('object')
					classes4.SYS_ACL.others.sub_acl.should.be.a('object')
					classes5.SYS_ACL.others.sub_acl.should.be.a('object')

					classes1.SYS_ACL.roles[0].should.be.a('object')
					classes2.SYS_ACL.roles[0].should.be.a('object')
					classes3.SYS_ACL.roles[0].should.be.a('object')
					classes4.SYS_ACL.roles[0].should.be.a('object')
					classes5.SYS_ACL.roles[0].should.be.a('object')

					classes1.SYS_ACL.roles[1].should.be.a('object')
					classes2.SYS_ACL.roles[1].should.be.a('object')
					classes3.SYS_ACL.roles[1].should.be.a('object')
					classes4.SYS_ACL.roles[1].should.be.a('object')


					// Value assertion
					classes1.uid.should.be.equal('built_io_application_user')
					classes2.uid.should.be.equal('built_io_application_user_role')
					classes3.uid.should.be.equal('built_io_installation_data')
					classes4.uid.should.be.equal('built_io_upload')
					classes5.uid.should.be.equal('supertest_class')

					classes1.SYS_ACL.others.read.should.be.equal(false)
					classes2.SYS_ACL.others.read.should.be.equal(false)
					classes3.SYS_ACL.others.read.should.be.equal(false)
					classes4.SYS_ACL.others.read.should.be.equal(true)
					classes5.SYS_ACL.others.read.should.be.equal(true)

					classes1.SYS_ACL.others.update.should.be.equal(false)
					classes2.SYS_ACL.others.update.should.be.equal(false)
					classes3.SYS_ACL.others.update.should.be.equal(false)
					classes4.SYS_ACL.others.update.should.be.equal(true)
					classes5.SYS_ACL.others.update.should.be.equal(true)

					classes1.SYS_ACL.others.delete.should.be.equal(false)
					classes2.SYS_ACL.others.delete.should.be.equal(false)
					classes3.SYS_ACL.others.delete.should.be.equal(false)
					classes4.SYS_ACL.others.delete.should.be.equal(true)
					classes5.SYS_ACL.others.delete.should.be.equal(true)

					classes1.SYS_ACL.others.sub_acl.read.should.be.equal(false)
					classes2.SYS_ACL.others.sub_acl.read.should.be.equal(false)
					classes3.SYS_ACL.others.sub_acl.read.should.be.equal(false)
					classes4.SYS_ACL.others.sub_acl.read.should.be.equal(false)
					classes5.SYS_ACL.others.sub_acl.read.should.be.equal(false)

					classes1.SYS_ACL.others.sub_acl.update.should.be.equal(false)
					classes2.SYS_ACL.others.sub_acl.update.should.be.equal(false)
					classes3.SYS_ACL.others.sub_acl.update.should.be.equal(false)
					classes4.SYS_ACL.others.sub_acl.update.should.be.equal(false)
					classes5.SYS_ACL.others.sub_acl.update.should.be.equal(false)

					classes1.SYS_ACL.others.sub_acl.delete.should.be.equal(false)
					classes2.SYS_ACL.others.sub_acl.delete.should.be.equal(false)
					classes3.SYS_ACL.others.sub_acl.delete.should.be.equal(false)
					classes4.SYS_ACL.others.sub_acl.delete.should.be.equal(false)
					classes5.SYS_ACL.others.sub_acl.delete.should.be.equal(false)

					classes1.SYS_ACL.roles[0].uid.should.be.equal(devRole)
					classes2.SYS_ACL.roles[0].uid.should.be.equal(devRole)
					classes3.SYS_ACL.roles[0].uid.should.be.equal(devRole)
					classes4.SYS_ACL.roles[0].uid.should.be.equal(devRole)

					classes1.SYS_ACL.roles[1].uid.should.be.equal(contentRole)
					classes2.SYS_ACL.roles[1].uid.should.be.equal(contentRole)
					classes3.SYS_ACL.roles[1].uid.should.be.equal(contentRole)
					classes4.SYS_ACL.roles[1].uid.should.be.equal(contentRole)
					// classes5.SYS_ACL.roles[1].uid.should.be.equal(contentRole)

					classes1.SYS_ACL.roles[0].read.should.be.equal(true)
					classes2.SYS_ACL.roles[0].read.should.be.equal(true)
					classes3.SYS_ACL.roles[0].read.should.be.equal(true)
					classes4.SYS_ACL.roles[0].read.should.be.equal(true)
					classes5.SYS_ACL.roles[0].read.should.be.equal(false)

					classes1.SYS_ACL.roles[1].read.should.be.equal(true)
					classes2.SYS_ACL.roles[1].read.should.be.equal(true)
					classes3.SYS_ACL.roles[1].read.should.be.equal(true)
					classes4.SYS_ACL.roles[1].read.should.be.equal(true)


					classes1.SYS_ACL.roles[0].update.should.be.equal(true)
					classes2.SYS_ACL.roles[0].update.should.be.equal(true)
					classes3.SYS_ACL.roles[0].update.should.be.equal(true)
					classes4.SYS_ACL.roles[0].update.should.be.equal(true)
					classes5.SYS_ACL.roles[0].update.should.be.equal(false)

					classes1.SYS_ACL.roles[1].update.should.be.equal(false)
					classes2.SYS_ACL.roles[1].update.should.be.equal(false)
					classes3.SYS_ACL.roles[1].update.should.be.equal(false)
					classes4.SYS_ACL.roles[1].update.should.be.equal(false)


					classes1.SYS_ACL.roles[0].delete.should.be.equal(true)
					classes2.SYS_ACL.roles[0].delete.should.be.equal(true)
					classes3.SYS_ACL.roles[0].delete.should.be.equal(true)
					classes4.SYS_ACL.roles[0].delete.should.be.equal(true)
					classes5.SYS_ACL.roles[0].delete.should.be.equal(false)

					classes1.SYS_ACL.roles[1].delete.should.be.equal(false)
					classes2.SYS_ACL.roles[1].delete.should.be.equal(false)
					classes3.SYS_ACL.roles[1].delete.should.be.equal(false)
					classes4.SYS_ACL.roles[1].delete.should.be.equal(false)


					//
					classes1.SYS_ACL.roles[0].sub_acl.read.should.be.equal(true)
					classes2.SYS_ACL.roles[0].sub_acl.read.should.be.equal(true)
					classes3.SYS_ACL.roles[0].sub_acl.read.should.be.equal(true)
					classes4.SYS_ACL.roles[0].sub_acl.read.should.be.equal(true)
					classes5.SYS_ACL.roles[0].sub_acl.read.should.be.equal(false)

					classes1.SYS_ACL.roles[1].sub_acl.read.should.be.equal(true)
					classes2.SYS_ACL.roles[1].sub_acl.read.should.be.equal(true)
					classes3.SYS_ACL.roles[1].sub_acl.read.should.be.equal(true)
					classes4.SYS_ACL.roles[1].sub_acl.read.should.be.equal(true)
					// classes5.SYS_ACL.roles[1].sub_acl.read.should.be.equal(false)

					classes1.SYS_ACL.roles[0].sub_acl.update.should.be.equal(true)
					classes2.SYS_ACL.roles[0].sub_acl.update.should.be.equal(true)
					classes3.SYS_ACL.roles[0].sub_acl.update.should.be.equal(true)
					classes4.SYS_ACL.roles[0].sub_acl.update.should.be.equal(true)
					classes5.SYS_ACL.roles[0].sub_acl.update.should.be.equal(false)

					classes1.SYS_ACL.roles[1].sub_acl.update.should.be.equal(true)
					classes2.SYS_ACL.roles[1].sub_acl.update.should.be.equal(true)
					classes3.SYS_ACL.roles[1].sub_acl.update.should.be.equal(true)
					classes4.SYS_ACL.roles[1].sub_acl.update.should.be.equal(true)
					// classes5.SYS_ACL.roles[1].sub_acl.update.should.be.equal(false)

					classes1.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(true)
					classes2.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(true)
					classes3.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(true)
					classes4.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(true)
					classes5.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(false)

					classes1.SYS_ACL.roles[1].sub_acl.delete.should.be.equal(true)
					classes2.SYS_ACL.roles[1].sub_acl.delete.should.be.equal(true)
					classes3.SYS_ACL.roles[1].sub_acl.delete.should.be.equal(true)
					classes4.SYS_ACL.roles[1].sub_acl.delete.should.be.equal(true)
					// classes5.SYS_ACL.roles[1].sub_acl.delete.should.be.equal(false)

					classes1.SYS_ACL.roles[0].sub_acl.create.should.be.equal(true)
					classes2.SYS_ACL.roles[0].sub_acl.create.should.be.equal(true)
					classes3.SYS_ACL.roles[0].sub_acl.create.should.be.equal(true)
					classes4.SYS_ACL.roles[0].sub_acl.create.should.be.equal(true)
					classes5.SYS_ACL.roles[0].sub_acl.create.should.be.equal(false)

					classes1.SYS_ACL.roles[1].sub_acl.create.should.be.equal(true)
					classes2.SYS_ACL.roles[1].sub_acl.create.should.be.equal(true)
					classes3.SYS_ACL.roles[1].sub_acl.create.should.be.equal(true)
					classes4.SYS_ACL.roles[1].sub_acl.create.should.be.equal(true)
					// classes5.SYS_ACL.roles[1].sub_acl.create.should.be.equal(false)

					done()

				})

		});


	});


	describe('Get classes bulk acl', function() {

		before(function(done) {
			this.timeout(15000)
			R.Promisify(factories.create('apply_bulk_sys_acl', authtoken, api_key, {
				"classes": [{
					"uid": "built_io_application_user",
					"SYS_ACL": {
						"roles": [{
							"uid": devRole,
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}, {
							"uid": contentRole,
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}],
						"others": {
							"read": false,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}
				}, {
					"uid": "built_io_application_user_role",
					"SYS_ACL": {
						"roles": [{
							"uid": devRole,
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}, {
							"uid": contentRole,
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}],
						"others": {
							"read": false,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}
				}, {
					"uid": "built_io_installation_data",
					"SYS_ACL": {
						"roles": [{
							"uid": devRole,
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}, {
							"uid": contentRole,
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}],
						"others": {
							"read": false,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}
				}, {
					"uid": "built_io_upload",
					"SYS_ACL": {
						"roles": [{
							"uid": devRole,
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}, {
							"uid": contentRole,
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": true,
								"update": true,
								"delete": true,
								"create": true
							}
						}],
						"others": {
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}
				}, {
					"uid": classUid,
					"SYS_ACL": {
						"roles": [{
							"uid": contentRole,
							"read": false,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}],
						"others": {
							"read": true,
							"update": true,
							"delete": true,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}
				}]

			}))
				.then(function(res) {
					done()
				})
				.catch(function(err) {
					console.log(err)
				})

		})

		it('should get bulk sys ACL applied on classes', function(done) {

			factories.create('get_bulk_sys_acl', authtoken, api_key)
				.end(function(err, res) {

					var classes1 = res.body.classes[0]
					var classes2 = res.body.classes[1]
					var classes3 = res.body.classes[2]
					var classes4 = res.body.classes[3]
					var classes5 = res.body.classes[4]

					// Value assertion
					classes1.uid.should.be.equal('built_io_application_user')
					classes2.uid.should.be.equal('built_io_application_user_role')
					classes3.uid.should.be.equal('built_io_installation_data')
					classes4.uid.should.be.equal('built_io_upload')
					classes5.uid.should.be.equal('supertest_class')

					classes1.SYS_ACL.others.read.should.be.equal(false)
					classes2.SYS_ACL.others.read.should.be.equal(false)
					classes3.SYS_ACL.others.read.should.be.equal(false)
					classes4.SYS_ACL.others.read.should.be.equal(true)
					classes5.SYS_ACL.others.read.should.be.equal(true)

					classes1.SYS_ACL.others.update.should.be.equal(false)
					classes2.SYS_ACL.others.update.should.be.equal(false)
					classes3.SYS_ACL.others.update.should.be.equal(false)
					classes4.SYS_ACL.others.update.should.be.equal(true)
					classes5.SYS_ACL.others.update.should.be.equal(true)

					classes1.SYS_ACL.others.delete.should.be.equal(false)
					classes2.SYS_ACL.others.delete.should.be.equal(false)
					classes3.SYS_ACL.others.delete.should.be.equal(false)
					classes4.SYS_ACL.others.delete.should.be.equal(true)
					classes5.SYS_ACL.others.delete.should.be.equal(true)

					classes1.SYS_ACL.others.sub_acl.read.should.be.equal(false)
					classes2.SYS_ACL.others.sub_acl.read.should.be.equal(false)
					classes3.SYS_ACL.others.sub_acl.read.should.be.equal(false)
					classes4.SYS_ACL.others.sub_acl.read.should.be.equal(false)
					classes5.SYS_ACL.others.sub_acl.read.should.be.equal(false)

					classes1.SYS_ACL.others.sub_acl.update.should.be.equal(false)
					classes2.SYS_ACL.others.sub_acl.update.should.be.equal(false)
					classes3.SYS_ACL.others.sub_acl.update.should.be.equal(false)
					classes4.SYS_ACL.others.sub_acl.update.should.be.equal(false)
					classes5.SYS_ACL.others.sub_acl.update.should.be.equal(false)

					classes1.SYS_ACL.others.sub_acl.delete.should.be.equal(false)
					classes2.SYS_ACL.others.sub_acl.delete.should.be.equal(false)
					classes3.SYS_ACL.others.sub_acl.delete.should.be.equal(false)
					classes4.SYS_ACL.others.sub_acl.delete.should.be.equal(false)
					classes5.SYS_ACL.others.sub_acl.delete.should.be.equal(false)

					classes1.SYS_ACL.roles[0].uid.should.be.equal(devRole)
					classes2.SYS_ACL.roles[0].uid.should.be.equal(devRole)
					classes3.SYS_ACL.roles[0].uid.should.be.equal(devRole)
					classes4.SYS_ACL.roles[0].uid.should.be.equal(devRole)
					classes5.SYS_ACL.roles[0].uid.should.be.equal(contentRole)

					classes1.SYS_ACL.roles[1].uid.should.be.equal(contentRole)
					classes2.SYS_ACL.roles[1].uid.should.be.equal(contentRole)
					classes3.SYS_ACL.roles[1].uid.should.be.equal(contentRole)
					classes4.SYS_ACL.roles[1].uid.should.be.equal(contentRole)

					classes1.SYS_ACL.roles[0].read.should.be.equal(true)
					classes2.SYS_ACL.roles[0].read.should.be.equal(true)
					classes3.SYS_ACL.roles[0].read.should.be.equal(true)
					classes4.SYS_ACL.roles[0].read.should.be.equal(true)
					classes5.SYS_ACL.roles[0].read.should.be.equal(false)

					classes1.SYS_ACL.roles[1].read.should.be.equal(true)
					classes2.SYS_ACL.roles[1].read.should.be.equal(true)
					classes3.SYS_ACL.roles[1].read.should.be.equal(true)
					classes4.SYS_ACL.roles[1].read.should.be.equal(true)

					classes1.SYS_ACL.roles[0].update.should.be.equal(true)
					classes2.SYS_ACL.roles[0].update.should.be.equal(true)
					classes3.SYS_ACL.roles[0].update.should.be.equal(true)
					classes4.SYS_ACL.roles[0].update.should.be.equal(true)
					classes5.SYS_ACL.roles[0].update.should.be.equal(false)

					classes1.SYS_ACL.roles[1].update.should.be.equal(false)
					classes2.SYS_ACL.roles[1].update.should.be.equal(false)
					classes3.SYS_ACL.roles[1].update.should.be.equal(false)
					classes4.SYS_ACL.roles[1].update.should.be.equal(false)

					classes1.SYS_ACL.roles[0].delete.should.be.equal(true)
					classes2.SYS_ACL.roles[0].delete.should.be.equal(true)
					classes3.SYS_ACL.roles[0].delete.should.be.equal(true)
					classes4.SYS_ACL.roles[0].delete.should.be.equal(true)
					classes5.SYS_ACL.roles[0].delete.should.be.equal(false)

					classes1.SYS_ACL.roles[1].delete.should.be.equal(false)
					classes2.SYS_ACL.roles[1].delete.should.be.equal(false)
					classes3.SYS_ACL.roles[1].delete.should.be.equal(false)
					classes4.SYS_ACL.roles[1].delete.should.be.equal(false)


					//
					classes1.SYS_ACL.roles[0].sub_acl.read.should.be.equal(true)
					classes2.SYS_ACL.roles[0].sub_acl.read.should.be.equal(true)
					classes3.SYS_ACL.roles[0].sub_acl.read.should.be.equal(true)
					classes4.SYS_ACL.roles[0].sub_acl.read.should.be.equal(true)
					classes5.SYS_ACL.roles[0].sub_acl.read.should.be.equal(false)

					classes1.SYS_ACL.roles[1].sub_acl.read.should.be.equal(true)
					classes2.SYS_ACL.roles[1].sub_acl.read.should.be.equal(true)
					classes3.SYS_ACL.roles[1].sub_acl.read.should.be.equal(true)
					classes4.SYS_ACL.roles[1].sub_acl.read.should.be.equal(true)

					classes1.SYS_ACL.roles[0].sub_acl.update.should.be.equal(true)
					classes2.SYS_ACL.roles[0].sub_acl.update.should.be.equal(true)
					classes3.SYS_ACL.roles[0].sub_acl.update.should.be.equal(true)
					classes4.SYS_ACL.roles[0].sub_acl.update.should.be.equal(true)
					classes5.SYS_ACL.roles[0].sub_acl.update.should.be.equal(false)

					classes1.SYS_ACL.roles[1].sub_acl.update.should.be.equal(true)
					classes2.SYS_ACL.roles[1].sub_acl.update.should.be.equal(true)
					classes3.SYS_ACL.roles[1].sub_acl.update.should.be.equal(true)
					classes4.SYS_ACL.roles[1].sub_acl.update.should.be.equal(true)

					classes1.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(true)
					classes2.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(true)
					classes3.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(true)
					classes4.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(true)
					classes5.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(false)

					classes1.SYS_ACL.roles[1].sub_acl.delete.should.be.equal(true)
					classes2.SYS_ACL.roles[1].sub_acl.delete.should.be.equal(true)
					classes3.SYS_ACL.roles[1].sub_acl.delete.should.be.equal(true)
					classes4.SYS_ACL.roles[1].sub_acl.delete.should.be.equal(true)

					classes1.SYS_ACL.roles[0].sub_acl.create.should.be.equal(true)
					classes2.SYS_ACL.roles[0].sub_acl.create.should.be.equal(true)
					classes3.SYS_ACL.roles[0].sub_acl.create.should.be.equal(true)
					classes4.SYS_ACL.roles[0].sub_acl.create.should.be.equal(true)
					classes5.SYS_ACL.roles[0].sub_acl.create.should.be.equal(false)

					classes1.SYS_ACL.roles[1].sub_acl.create.should.be.equal(true)
					classes2.SYS_ACL.roles[1].sub_acl.create.should.be.equal(true)
					classes3.SYS_ACL.roles[1].sub_acl.create.should.be.equal(true)
					classes4.SYS_ACL.roles[1].sub_acl.create.should.be.equal(true)

					done()

				})

		});

		it('should get bulk sys ACL applied on specified class', function(done) {

			factories.create('get_bulk_sys_acl', authtoken, api_key, {
				class_uids: '["supertest_class", "built_io_upload"]'
			})
			.end(function(err, res) {
				var classes1 = res.body.classes[0]
				var classes2 = res.body.classes[1]

				// key assertion 
				Object.keys(classes1).should.to.be.deep.equal(['uid', 'SYS_ACL'])
				Object.keys(classes2).should.to.be.deep.equal(['uid', 'SYS_ACL'])

				Object.keys(classes1.SYS_ACL).should.to.be.deep.equal(['others', 'roles'])
				Object.keys(classes2.SYS_ACL).should.to.be.deep.equal(['others', 'roles'])

				Object.keys(classes1.SYS_ACL.others).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])
				Object.keys(classes2.SYS_ACL.others).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])

				Object.keys(classes1.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
				Object.keys(classes2.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])

				Object.keys(classes1.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
				// Object.keys(classes2.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])

				Object.keys(classes1.SYS_ACL.others.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
				Object.keys(classes2.SYS_ACL.others.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])

				Object.keys(classes1.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
				Object.keys(classes2.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])

				Object.keys(classes1.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
				// Object.keys(classes2.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])

				Object.keys(classes1.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
				Object.keys(classes2.SYS_ACL.roles[0]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])

				Object.keys(classes1.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])
				// Object.keys(classes2.SYS_ACL.roles[1]).should.to.be.deep.equal(['uid', 'read', 'update', 'delete', 'sub_acl'])

				Object.keys(classes1.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
				Object.keys(classes2.SYS_ACL.roles[0].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])

				Object.keys(classes1.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
				// Object.keys(classes2.SYS_ACL.roles[1].sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])

				// data assertion
				classes1.uid.should.be.a('string')
				classes2.uid.should.be.a('string')
				classes1.SYS_ACL.should.be.a('object')
				classes2.SYS_ACL.should.be.a('object')
				classes1.SYS_ACL.others.should.be.a('object')
				classes2.SYS_ACL.others.should.be.a('object')
				classes1.SYS_ACL.others.sub_acl.should.be.a('object')
				classes2.SYS_ACL.others.sub_acl.should.be.a('object')
				classes1.SYS_ACL.roles[0].should.be.a('object')
				classes2.SYS_ACL.roles[0].should.be.a('object')
				classes1.SYS_ACL.roles[1].should.be.a('object')
				// classes2.SYS_ACL.roles[1].should.be.a('object')

				// value assertion	
				classes1.uid.should.be.equal('built_io_upload')
				classes2.uid.should.be.equal('supertest_class')

				classes1.SYS_ACL.others.read.should.be.equal(true)
				classes2.SYS_ACL.others.read.should.be.equal(true)
				classes1.SYS_ACL.others.update.should.be.equal(true)
				classes2.SYS_ACL.others.update.should.be.equal(true)
				classes1.SYS_ACL.others.delete.should.be.equal(true)
				classes2.SYS_ACL.others.delete.should.be.equal(true)
				classes1.SYS_ACL.others.sub_acl.read.should.be.equal(false)
				classes2.SYS_ACL.others.sub_acl.read.should.be.equal(false)
				classes1.SYS_ACL.others.sub_acl.update.should.be.equal(false)
				classes2.SYS_ACL.others.sub_acl.update.should.be.equal(false)
				classes1.SYS_ACL.others.sub_acl.delete.should.be.equal(false)
				classes2.SYS_ACL.others.sub_acl.delete.should.be.equal(false)
				classes1.SYS_ACL.roles[0].uid.should.be.equal(devRole)
				classes2.SYS_ACL.roles[0].uid.should.be.equal(contentRole)
				// classes1.SYS_ACL.roles[1].uid.should.be.equal(contentRole)
				// classes2.SYS_ACL.roles[1].uid.should.be.equal(contentRole)
				classes1.SYS_ACL.roles[0].read.should.be.equal(true)
				classes2.SYS_ACL.roles[0].read.should.be.equal(false)
				classes1.SYS_ACL.roles[1].read.should.be.equal(true)
				// classes2.SYS_ACL.roles[1].read.should.be.equal(false)
				classes1.SYS_ACL.roles[0].update.should.be.equal(true)
				classes2.SYS_ACL.roles[0].update.should.be.equal(false)
				classes1.SYS_ACL.roles[1].update.should.be.equal(false)
				// classes2.SYS_ACL.roles[1].update.should.be.equal(false)
				classes1.SYS_ACL.roles[0].delete.should.be.equal(true)
				classes2.SYS_ACL.roles[0].delete.should.be.equal(false)
				classes1.SYS_ACL.roles[1].delete.should.be.equal(false)
				// classes2.SYS_ACL.roles[1].delete.should.be.equal(false)
				classes1.SYS_ACL.roles[0].sub_acl.read.should.be.equal(true)
				classes2.SYS_ACL.roles[0].sub_acl.read.should.be.equal(false)
				classes1.SYS_ACL.roles[1].sub_acl.read.should.be.equal(true)
				// classes2.SYS_ACL.roles[1].sub_acl.read.should.be.equal(false)
				classes1.SYS_ACL.roles[0].sub_acl.update.should.be.equal(true)
				classes2.SYS_ACL.roles[0].sub_acl.update.should.be.equal(false)
				classes1.SYS_ACL.roles[1].sub_acl.update.should.be.equal(true)
				// classes2.SYS_ACL.roles[1].sub_acl.update.should.be.equal(false)
				classes1.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(true)
				classes2.SYS_ACL.roles[0].sub_acl.delete.should.be.equal(false)
				classes1.SYS_ACL.roles[1].sub_acl.delete.should.be.equal(true)
				// classes2.SYS_ACL.roles[1].sub_acl.delete.should.be.equal(false)
				classes1.SYS_ACL.roles[0].sub_acl.create.should.be.equal(true)
				classes2.SYS_ACL.roles[0].sub_acl.create.should.be.equal(false)
				classes1.SYS_ACL.roles[1].sub_acl.create.should.be.equal(true)
				// classes2.SYS_ACL.roles[1].sub_acl.create.should.be.equal(false)


				done()

			})

		});

	
	});


	describe('Collaborators permissions', function() {

		// var supertestRole
		// console.log(role)
		before(function(done) {
			this.timeout(15000)

			R.Promisify(factories.create('login_system_user', config.user3))
				.then(function(res) {
					authtoken_2 = res.body.user.authtoken;
					userUID_2   = res.body.user.uid;
					username_2  = res.body.user.username;
					email_2     = res.body.user.email;
				})
				.then(function(res) {
					return R.Promisify(factories.create('invite_collaborator', authtoken, api_key, {
						"emails": [
							email_2
						]
					}))
				})
				.then(function(res) {
					return R.Promisify(factories.create('Create_system_role', authtoken, api_key, {
						"name": "supertestRole",
						"description": "supertestRole in supertest app"
					}))
				})
				.then(function(res) {
					supertestRole = res.body.system_role
				})
				.then(function(res) {
					done()
				})
				.catch(function(err) {
					console.log(err)
				})

		})


		it('should set roles to collaborators in bulk', function(done) {
			// console.log(userUID_2)
			// console.log(email_2)
			// console.log(supertestRole)
			this.timeout(55000)
			var users = {}

			users[userUID_2] = [
				supertestRole,
				contentRole
			]

			factories.create('set_role_collaborator', authtoken, api_key, {
				users: users
			})
				.end(function(err, res) {
					// R.pretty(res.body)
					res.body.notice.should.be.equal("The roles were applied successfully.")

					var users1 = res.body.users[1]
					var users2 = res.body.users[0]
					

				// // key assertions
				// 	Object.keys(users2).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'email', 'username', 'plan_id', 'roles'])
				// 	Object.keys(users2.roles[0]).should.to.be.deep.equal(['uid', 'name', 'description', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL'])
				// 	Object.keys(users2.roles[1]).should.to.be.deep.equal(['uid', 'name', 'description', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL'])
				// 	Object.keys(users1).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'email', 'username', 'plan_id', 'roles'])
				// 	Object.keys(users1.roles[0]).should.to.be.deep.equal(['uid', 'name', 'description', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL'])

				// 	// value assertions
				// 	users2.uid.should.be.equal(userUID_1)
				// 	users2.email.should.be.equal(email_1)
				// 	users2.username.should.be.equal(username_1)

				// 	users2.roles[0].uid.should.be.equal(devRole)
				// 	users2.roles[0].users[0].should.be.equal(userUID_1)
				// 	users2.roles[0].owner.should.be.equal(email)
				// 	users2.roles[0].application.api_key.should.be.equal(api_key)
				// 	users2.roles[0].application.owner_uid.should.be.equal(userUID)
				// 	users2.roles[0].application.master_key.should.be.equal(master_key)
				// 	users2.roles[0].application.user_uids[0].should.be.equal(userUID)
				// 	users2.roles[0].application.user_uids[1].should.be.equal(userUID_1)
				// 	users2.roles[0].application.user_uids[2].should.be.equal(userUID_2)

				// 	users2.roles[1].uid.should.be.equal(contentRole)
				// 	users2.roles[1].users[0].should.be.equal(userUID_1)
				// 	users2.roles[1].owner.should.be.equal(email)
				// 	users2.roles[1].application.api_key.should.be.equal(api_key)
				// 	users2.roles[0].application.master_key.should.be.equal(master_key)
				// 	users2.roles[1].application.owner_uid.should.be.equal(userUID)

				// 	users1.uid.should.be.equal(userUID_2)
				// 	users1.email.should.be.equal(email_2)
				// 	users1.username.should.be.equal(username_2)

				// 	users1.roles[0].uid.should.be.equal(supertestRole)
				// 	users1.roles[0].users[0].should.be.equal(userUID_2)
				// 	users1.roles[0].owner.should.be.equal(email)
				// 	users1.roles[0].application.api_key.should.be.equal(api_key)
				// 	users1.roles[0].application.owner_uid.should.be.equal(userUID)
				// 	users1.roles[0].application.master_key.should.be.equal(master_key)
				// 	users1.roles[0].application.user_uids[0].should.be.equal(userUID)
				// 	users1.roles[0].application.user_uids[1].should.be.equal(userUID_1)
				// 	users1.roles[0].application.user_uids[2].should.be.equal(userUID_2)



					done()
				})

		});

		
		it('should Fetch permissions for one or more users', function(done) {

			factories.create('get_permissions_user', authtoken, api_key, {
				users: [userUID, userUID_2]
			})
				.end(function(err, res) {

					// R.pretty(res.body, err)

					var users1 = res.body.users[0]
					var users2 = res.body.users[1]

					// R.pretty(users1)

					Object.keys(users2).should.to.be.deep.equal(['uid', 'classes', 'isOwner'])
					Object.keys(users2.classes).should.to.be.deep.equal(['built_io_application_user', 'built_io_application_user_role', 'built_io_installation_data', 'built_io_upload', 'supertest_class'])

					Object.keys(users1).should.to.be.deep.equal(['uid', 'classes'])
					Object.keys(users1.classes).should.to.be.deep.equal(['built_io_application_user', 'built_io_application_user_role', 'built_io_installation_data', 'built_io_upload', 'supertest_class'])



					done()
				})

		});


		it('should Fetch permissions for one or more users after updating role', function(done) {
			
			R.Promisify(factories.create('Update_system_role', authtoken, api_key, supertestRole.uid, {
				"name": "testRole"
			}))
			.then(function(res) {
				return factories.create('Get_system_roles', authtoken, api_key, {
					"include_permissions": true
				}) 
			})
			.then(function(res) {
				// R.pretty(res.body)

				var roles = res.body.system_roles[0]

			// // key assertion
			// 	Object.keys(roles).should.to.be.deep.equal(['uid', 'name', 'description', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL', 'permissions'])
			// 	Object.keys(roles.permissions[0]).should.to.be.deep.equal(['class_uid', 'SYS_ACL'])
			// 	Object.keys(roles.permissions[1]).should.to.be.deep.equal(['class_uid', 'SYS_ACL'])
			// 	Object.keys(roles.permissions[0].SYS_ACL).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])
			// 	Object.keys(roles.permissions[0].SYS_ACL.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
			// 	Object.keys(roles.permissions[1].SYS_ACL).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])
			// 	Object.keys(roles.permissions[1].SYS_ACL.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])

			// 	// Data assertion
			// 	roles.uid.should.be.a('string')
			// 	roles.name.should.be.a('string')
			// 	roles.users.should.be.a('array')
			// 	roles.roles.should.be.a('array')
			// 	roles.created_at.should.be.a('string')
			// 	roles.updated_at.should.be.a('string')
			// 	roles.owner.should.be.a('string')
			// 	roles.application.should.be.a('object')
			// 	roles.SYS_ACL.should.be.a('object')
			// 	roles.permissions.should.be.a('array')

			// 	// value assertion
			// 	roles.uid.should.be.equal(devRole1)
			// 	roles.created_at.should.be.equal(roles.updated_at)
			// 	roles.owner.should.be.equal(email)
			// 	roles.application.api_key.should.be.equal(api_key1)
			// 	roles.application.owner_uid.should.be.equal(userUID)

			// 	roles.permissions[0].class_uid.should.be.equal(classUid1)
			// 	roles.permissions[0].SYS_ACL.read.should.be.equal(true)
			// 	roles.permissions[0].SYS_ACL.update.should.be.equal(false)
			// 	roles.permissions[0].SYS_ACL.delete.should.be.equal(false)
			// 	roles.permissions[0].SYS_ACL.sub_acl.read.should.be.equal(false)
			// 	roles.permissions[0].SYS_ACL.sub_acl.update.should.be.equal(false)
			// 	roles.permissions[0].SYS_ACL.sub_acl.delete.should.be.equal(false)
			// 	roles.permissions[0].SYS_ACL.sub_acl.create.should.be.equal(false)

			// 	roles.permissions[1].class_uid.should.be.equal('built_io_upload')
			// 	roles.permissions[1].SYS_ACL.read.should.be.equal(true)
			// 	roles.permissions[1].SYS_ACL.update.should.be.equal(false)
			// 	roles.permissions[1].SYS_ACL.delete.should.be.equal(false)
			// 	roles.permissions[1].SYS_ACL.sub_acl.read.should.be.equal(true)
			// 	roles.permissions[1].SYS_ACL.sub_acl.update.should.be.equal(false)
			// 	roles.permissions[1].SYS_ACL.sub_acl.delete.should.be.equal(false)
			// 	roles.permissions[1].SYS_ACL.sub_acl.create.should.be.equal(false)
			})
			.then(function(res) {
				done()
			})


		});


	});


	describe('system roles Bulk ACL', function() {

		before(function(done) {
			
			this.timeout(15000)
			
			R.Promisify(factories.create('Create_application', authtoken))
			.then(function(res) {
				api_key1    = res.body.application.api_key;
				master_key1 = res.body.application.master_key;
				appname1    = res.body.application.name;
				appUid1     = res.body.application.uid
			})
			.then(function(res) {
				return R.Promisify(factories.create('Create_class', authtoken, api_key1, {
					"class": {
						"title": "supertest_numClass",
						"uid": "supertest_numClass",
						"maintain_revisions": true,
						"schema": [{
							"multiple": false,
							"mandatory": true,
							"display_name": "Name",
							"uid": "name",
							"data_type": "number"
						}],
						"DEFAULT_ACL": {
							"others": {
								"create": false,
								"read": false
							}
						}
					}
				}))
			})
			.then(function(res) {
				classUid1 = res.body.class.uid
			})
			.then(function(res) {
				return R.Promisify(factories.create('Create_system_role', authtoken, api_key1, {
					"name": "newRole"
				}))
			})
			.then(function(res) {

				roleid = res.body.system_role.uid
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})

		})

		after(function(done) {
			factories.create('Delete_application', authtoken, api_key1)
				.end(function(err, res1) {
					// console.log("application delete")
					done(err)
				})

		})

		it('should apply system roles on classes in bulk', function(done) {

			factories.create('set_role_bulk_acl', authtoken, api_key1, {
				"system_roles": [{
					"uid": roleid,
					"classes": [{
						"uid": classUid1,
						"SYS_ACL": {
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}, {
						"uid": "built_io_upload",
						"SYS_ACL": {
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": true,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}]
				}]
			})
			.end(function(err, res) {
				
				var roles = res.body.system_roles[0]

				// key assertion
				Object.keys(roles).should.to.be.deep.equal(['uid', 'name', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL', 'permissions'])
				Object.keys(roles.permissions[0]).should.to.be.deep.equal(['class_uid', 'SYS_ACL'])
				Object.keys(roles.permissions[1]).should.to.be.deep.equal(['class_uid', 'SYS_ACL'])
				Object.keys(roles.permissions[0].SYS_ACL).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])
				Object.keys(roles.permissions[0].SYS_ACL.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
				Object.keys(roles.permissions[1].SYS_ACL).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])
				Object.keys(roles.permissions[1].SYS_ACL.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])

				// Data assertion
				roles.uid.should.be.a('string')
				roles.name.should.be.a('string')
				roles.users.should.be.a('array')
				roles.roles.should.be.a('array')
				roles.created_at.should.be.a('string')
				roles.updated_at.should.be.a('string')
				roles.owner.should.be.a('string')
				roles.application.should.be.a('object')
				roles.SYS_ACL.should.be.a('object')
				roles.permissions.should.be.a('array')

				// value assertion
				roles.uid.should.be.equal(roleid)
				roles.created_at.should.be.equal(roles.updated_at)
				roles.owner.should.be.equal(email)
				roles.application.api_key.should.be.equal(api_key1)
				roles.application.owner_uid.should.be.equal(userUID)

				roles.permissions[0].class_uid.should.be.equal(classUid1)
				roles.permissions[0].SYS_ACL.read.should.be.equal(true)
				roles.permissions[0].SYS_ACL.update.should.be.equal(false)
				roles.permissions[0].SYS_ACL.delete.should.be.equal(false)
				roles.permissions[0].SYS_ACL.sub_acl.read.should.be.equal(false)
				roles.permissions[0].SYS_ACL.sub_acl.update.should.be.equal(false)
				roles.permissions[0].SYS_ACL.sub_acl.delete.should.be.equal(false)
				roles.permissions[0].SYS_ACL.sub_acl.create.should.be.equal(false)

				roles.permissions[1].class_uid.should.be.equal('built_io_upload')
				roles.permissions[1].SYS_ACL.read.should.be.equal(true)
				roles.permissions[1].SYS_ACL.update.should.be.equal(false)
				roles.permissions[1].SYS_ACL.delete.should.be.equal(false)
				roles.permissions[1].SYS_ACL.sub_acl.read.should.be.equal(true)
				roles.permissions[1].SYS_ACL.sub_acl.update.should.be.equal(false)
				roles.permissions[1].SYS_ACL.sub_acl.delete.should.be.equal(false)
				roles.permissions[1].SYS_ACL.sub_acl.create.should.be.equal(false)

				done(err)

			})

		})

	
	});


	describe('permissions', function() {
		

		before(function(done) {
			this.timeout(25000)

			R.Promisify(factories.create('Create_application', authtoken))
				
				.then(function(res) {
					api_key1    = res.body.application.api_key;
					master_key1 = res.body.application.master_key;
					appname1    = res.body.application.name;
					appUid1     = res.body.application.uid
				})
				.then(function() {
					return R.Promisify(factories.create('Create_class', authtoken, api_key1, {
						"class": {
							"title": "supertest class",
							"uid": "supertest_class",
							"maintain_revisions": true,
							"schema": [{
								"multiple": false,
								"mandatory": true,
								"display_name": "Name",
								"uid": "name",
								"data_type": "text"
							}],
							"DEFAULT_ACL": {
								"others": {
									"create": false,
									"read": false
								}
							}
						}
					}))
				})
				.then(function(res) {
					classUid1 = res.body.class.uid
				})
				.then(function() {
					return R.Promisify(factories.create('invite_collaborator', authtoken, api_key1, {
						"emails": [
							email_1
						]
					}))
				})
				.then(function() {
					return R.Promisify(factories.create('Create_system_role', authtoken, api_key1, {
						name: 'Dev manager',
						"description": "Dev manager system role in supertest app"
					}))
				})
				.then(function(res) {
					devRole1 = res.body.system_role.uid
				})
				.then(function() {
					return R.Promisify(factories.create('Create_system_role', authtoken, api_key1, {
						name: 'Content manager',
						"description": "Content manager system role in supertest app"
					}))
				})
				.then(function(res) {
					contentRole1 = res.body.system_role.uid
				})
				.then(function() {
					return R.Promisify(factories.create('Update_application', authtoken, api_key1, {
						"application": {
							"SYS_ACL": {
								"others": {
									"invite": false,
									"sub_acl": {
										"create": false,
										"read": false,
										"update": false,
										"delete": false
									}
								},
								"roles": [{
									"uid": devRole1,
									"invite": true,
									"sub_acl": {
										"create": true,
										"read": true,
										"update": true,
										"delete": true
									}
								}]
							}
						}
					}))
				})
				.then(function(res) {
					done()
				})
				.catch(function(err) {
					console.log(err)
				})

		})

		before(function(done) {
		
			R.Promisify(factories.create('set_role_bulk_acl', authtoken, api_key1, {
				"system_roles": [{
					"uid": devRole1,
					"classes": [{
						"uid": classUid1,
						"SYS_ACL": {
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": false,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}, {
						"uid": "built_io_upload",
						"SYS_ACL": {
							"read": true,
							"update": false,
							"delete": false,
							"sub_acl": {
								"read": true,
								"update": false,
								"delete": false,
								"create": false
							}
						}
					}]
				}]
			}))
			.then(function(res) {
				done()
			})
		
		})

		
		after(function(done) {
			factories.create('Delete_application', authtoken, api_key1)
				.end(function(err, res1) {
					// console.log("application delete")
					done(err)
				})

		})


		it('should get all roles, and the ACL set for it on each class', function(done) {

			factories.create('Get_system_roles', authtoken, api_key1, {
				"include_permissions": true
			})
			.end(function(err, res) {
				
				var roles = res.body.system_roles[0]

				// key assertion
				Object.keys(roles).should.to.be.deep.equal(['uid', 'name', 'description', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL', 'permissions'])
				Object.keys(roles.permissions[0]).should.to.be.deep.equal(['class_uid', 'SYS_ACL'])
				Object.keys(roles.permissions[1]).should.to.be.deep.equal(['class_uid', 'SYS_ACL'])
				Object.keys(roles.permissions[0].SYS_ACL).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])
				Object.keys(roles.permissions[0].SYS_ACL.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])
				Object.keys(roles.permissions[1].SYS_ACL).should.to.be.deep.equal(['read', 'update', 'delete', 'sub_acl'])
				Object.keys(roles.permissions[1].SYS_ACL.sub_acl).should.to.be.deep.equal(['read', 'update', 'delete', 'create'])

				// Data assertion
				roles.uid.should.be.a('string')
				roles.name.should.be.a('string')
				roles.users.should.be.a('array')
				roles.roles.should.be.a('array')
				roles.created_at.should.be.a('string')
				roles.updated_at.should.be.a('string')
				roles.owner.should.be.a('string')
				roles.application.should.be.a('object')
				roles.SYS_ACL.should.be.a('object')
				roles.permissions.should.be.a('array')

				// value assertion
				roles.uid.should.be.equal(devRole1)
				roles.created_at.should.be.equal(roles.updated_at)
				roles.owner.should.be.equal(email)
				roles.application.api_key.should.be.equal(api_key1)
				roles.application.owner_uid.should.be.equal(userUID)

				roles.permissions[0].class_uid.should.be.equal(classUid1)
				roles.permissions[0].SYS_ACL.read.should.be.equal(true)
				roles.permissions[0].SYS_ACL.update.should.be.equal(false)
				roles.permissions[0].SYS_ACL.delete.should.be.equal(false)
				roles.permissions[0].SYS_ACL.sub_acl.read.should.be.equal(false)
				roles.permissions[0].SYS_ACL.sub_acl.update.should.be.equal(false)
				roles.permissions[0].SYS_ACL.sub_acl.delete.should.be.equal(false)
				roles.permissions[0].SYS_ACL.sub_acl.create.should.be.equal(false)

				roles.permissions[1].class_uid.should.be.equal('built_io_upload')
				roles.permissions[1].SYS_ACL.read.should.be.equal(true)
				roles.permissions[1].SYS_ACL.update.should.be.equal(false)
				roles.permissions[1].SYS_ACL.delete.should.be.equal(false)
				roles.permissions[1].SYS_ACL.sub_acl.read.should.be.equal(true)
				roles.permissions[1].SYS_ACL.sub_acl.update.should.be.equal(false)
				roles.permissions[1].SYS_ACL.sub_acl.delete.should.be.equal(false)
				roles.permissions[1].SYS_ACL.sub_acl.create.should.be.equal(false)

				done(err)
			
			})

		});

	});

})