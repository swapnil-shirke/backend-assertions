describe('Objects revisions/revert --- ', function() {
	var authtoken, userUID, username, email
	var api_key, appname
	var classUid, objectUid
	var authtoken_1, userUID_1, username_1, email_1
	var tenant_uid



	before(function(done) {
		this.timeout(15000)

		R.Promisify(factories.create('login_system_user'))
			.then(function(res) {
				authtoken = res.body.user.authtoken;
				userUID = res.body.user.uid;
				username = res.body.user.username;
				email = res.body.user.email;
			})
			.then(function() {
				return R.Promisify(factories.create('Create_application', authtoken))
			})
			.then(function(res) {
				api_key = res.body.application.api_key;
				master_key = res.body.application.master_key;
				appname = res.body.application.name;
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
						}]
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
			.then(function(res) {

				done()
			})
			.catch(function(err) {
				console.log(err)
			})

	})


	beforeEach(function(done) {

		R.Promisify(factories.create('Create_object', authtoken, api_key, classUid, {
			"object": {
				"name": "supertest"
			}
		}))
			.then(function(res) {
				objectUid = res.body.object.uid
			})
			.then(function() {
				done()
			})

	})


	after(function(done) {
		factories.create('Delete_application', authtoken, api_key)
			.end(function(err, res1) {
				// console.log("application delete")
				done(err)
			})

	})



	describe('get object', function() {

		var objectName = R.bltRandom(3)

		it('should get object owner information in created_by key', function(done) {

			factories.create('get_object', authtoken, api_key, classUid, objectUid, {
				"_method": "get",
				"include_created_by": true
			})
			.end(function(err, res) {
				// R.pretty(res.body)
				var object = res.body.object

				// Keys assertion        
				Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])
				Object.keys(object.created_by).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'email', 'username', 'plan_id'])

				// Data type assertion
				object.name.should.be.a('string')
				object.app_user_object_uid.should.be.a('string')
				object.created_by.should.be.a('object')
				object.updated_by.should.be.a('string')
				object.created_at.should.be.a('string')
				object.updated_at.should.be.a('string')
				object.uid.should.be.a('string')
				object.published.should.be.a('boolean')
				object.ACL.should.be.a('object')

				object._version.should.be.a('number')
				object.tags.should.be.a('array')

				// Value assertion
				object.name.should.be.equal('supertest')
				object.app_user_object_uid.should.be.equal('system')

				object.created_by.uid.should.be.equal(userUID)
				object.created_by.uid.should.be.equal(object.updated_by)

				object.created_by.email.should.be.equal(email)
				object.created_by.username.should.be.equal(username)

				object.updated_by.should.be.equal(userUID)
				object.created_at.should.be.equal(object.updated_at)
				object.updated_at.should.be.equal(object.created_at)
				object.uid.should.be.equal(objectUid)
				object.published.should.be.equal(true)
				// object.ACL.should.be.equal({})

				object._version.should.be.equal(1)
				// object.tags.should.be.equal([])				               
				done()
			});

		});

		it('should get object owner information in updated_by key', function(done) {

			factories.create('get_object', authtoken, api_key, classUid, objectUid, {
				"_method": "get",
				"include_updated_by": true
			})
				.end(function(err, res) {
					// R.pretty(res.body)
					var object = res.body.object

					// Keys assertion        
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])
					Object.keys(object.updated_by).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'email', 'username', 'plan_id'])

					// Data type assertion
					object.name.should.be.a('string')
					object.app_user_object_uid.should.be.a('string')
					object.created_by.should.be.a('string')
					object.updated_by.should.be.a('object')
					object.created_at.should.be.a('string')
					object.updated_at.should.be.a('string')
					object.uid.should.be.a('string')
					object.published.should.be.a('boolean')
					object.ACL.should.be.a('object')

					object._version.should.be.a('number')
					object.tags.should.be.a('array')

					// Value assertion
					object.name.should.be.equal('supertest')
					object.app_user_object_uid.should.be.equal('system')

					object.updated_by.uid.should.be.equal(userUID)
					object.updated_by.uid.should.be.equal(object.created_by)

					object.updated_by.email.should.be.equal(email)
					object.updated_by.username.should.be.equal(username)

					object.created_by.should.be.equal(userUID)
					object.created_at.should.be.equal(object.updated_at)
					object.updated_at.should.be.equal(object.created_at)
					object.uid.should.be.equal(objectUid)
					object.published.should.be.equal(true)
					// object.ACL.should.be.equal({})

					object._version.should.be.equal(1)
					// object.tags.should.be.equal([])				               

					done()
				});

		});

		it('should get object owner information in updated_by/created_by key', function(done) {

			return R.Promisify(factories.create('update_object', authtoken_1, api_key, classUid, objectUid, {
					"object": {
						"name": "supertest_update"
					}
				}))
				.then(function(res) {
					
					var objectId = res.body.object.uid

					return R.Promisify(factories.create('get_all_objects', authtoken_1, api_key, classUid, {
						"_method": "get",
						"include_updated_by": true,
						"include_created_by": true
					}))
				})
				.then(function(res1) {

					// R.pretty(res1.body)

					var object = res1.body.objects[0]

					// Keys assertion        
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])
					Object.keys(object.updated_by).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'email', 'username', 'plan_id'])
					Object.keys(object.created_by).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'email', 'username', 'company', 'plan_id'])

					// Data type assertion
					object.name.should.be.a('string')
					object.app_user_object_uid.should.be.a('string')
					object.created_by.should.be.a('object')
					object.updated_by.should.be.a('object')
					object.created_at.should.be.a('string')
					object.updated_at.should.be.a('string')
					object.uid.should.be.a('string')
					object.published.should.be.a('boolean')
					object.ACL.should.be.a('object')

					object._version.should.be.a('number')
					object.tags.should.be.a('array')

					// Value assertion
					object.created_by.uid.should.be.equal(userUID)
					object.created_by.email.should.be.equal(email)
					object.created_by.username.should.be.equal(username)
					object.uid.should.be.equal(objectUid)
					object.updated_by.uid.should.be.equal(userUID_1)
					object.updated_by.email.should.be.equal(email_1)
					object.updated_by.username.should.be.equal(username_1)

					done()
				});

		});

		it('should get object with specific version', function(done) {

			return R.Promisify(factories.create('update_object', authtoken_1, api_key, classUid, objectUid, {
					"object": {
						"name": "supertest_update"
					}
				}))
				.then(function(res) {
					// R.pretty(res.body)
					var objectId = res.body.object.uid

					return R.Promisify(factories.create('get_object', authtoken, api_key, classUid, objectUid, {
						"version": 1
					}))
				})
				.then(function(res1) {

					// R.pretty(res1.body)

					var object = res1.body.object

					// Keys assertion        
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])

					// Data type assertion

					// value assertion
					object.uid.should.be.equal(objectUid)
					object.name.should.be.equal('supertest')
					object.app_user_object_uid.should.be.equal('system')
					object.updated_by.should.be.equal(userUID)
					object.created_by.should.be.equal(userUID)
					object.published.should.be.equal(true)
					object._version.should.be.equal(1)
					done()
				});

		});

		it('should get all objects with revisions', function(done) {
			// R.pretty(res.body)
			return R.Promisify(factories.create('update_object', authtoken_1, api_key, classUid, objectUid, {
					"object": {
						"name": "supertest_update"
					}
				}))
				.then(function(res) {

					var objectId = res.body.object.uid

					return R.Promisify(factories.create('get_revisions', authtoken, api_key, classUid, objectUid, {
						"uid": objectUid
					}))
				})
				.then(function(res1) {

					// R.pretty(res1.body)

					var object1 = res1.body.objects[0]
					var object2 = res1.body.objects[1]
						// Keys assertion        
					Object.keys(object1).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])
					Object.keys(object2).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])

					// Data assertion

					// value assertion
					object1.uid.should.be.equal(objectUid)
					object1.name.should.be.equal('supertest_update')
					object1.app_user_object_uid.should.be.equal('system')
					object1.updated_by.should.be.equal(userUID_1)
					object1.created_by.should.be.equal(userUID)
					object1.published.should.be.equal(true)
					object1.created_at.should.be.not.equal(object1.updated_at)
					object1._version.should.be.equal(2)

					object2.uid.should.be.equal(objectUid)
					object2.name.should.be.equal('supertest')
					object2.app_user_object_uid.should.be.equal('system')
					object2.updated_by.should.be.equal(userUID)
					object2.updated_by.should.be.equal(object2.created_by)
					object2.created_by.should.be.equal(userUID)
					object2.published.should.be.equal(true)
					object2.created_at.should.be.equal(object2.updated_at)
					object2._version.should.be.equal(1)

					done()
				});

		});

	});


	describe('object update', function() {

		it('should update object with preserve_version', function(done) {

			return R.Promisify(factories.create('update_preserve_version', authtoken_1, api_key, classUid, objectUid, {
					"object": {
						"name": "supertest_update"
					}
				}))
				.then(function(res1) {

					// R.pretty(res1.body)

					var object = res1.body.object
					res1.body.notice.should.be.equal("Woot! Object updated successfully.")

					// Keys assertion        
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])

					// Data assertion
					object.uid.should.be.equal(objectUid)
					object.name.should.be.equal('supertest_update')
					object.app_user_object_uid.should.be.equal('system')
					object.updated_by.should.be.not.equal(object.created_by)
					object.created_by.should.be.equal(userUID)
					object.updated_by.should.be.equal(userUID_1)
					object.published.should.be.equal(true)
					object.created_at.should.be.not.equal(object.updated_at)

					object._version.should.be.equal(1)
					done()
				});

		});

		it('should perform a silent update on object', function(done) {

			return R.Promisify(factories.create('update_object', authtoken_1, api_key, classUid, objectUid, {
					"object": {
						"name": "supertest_update"
					}
				}, {
					"timeless": true
				}))
				.then(function(res1) {

					// R.pretty(res1.body)

					var object = res1.body.object
					res1.body.notice.should.be.equal("Woot! Object updated successfully.")
					// Keys assertion        
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])

					// Data assertion
					object.uid.should.be.equal(objectUid)
					object.name.should.be.equal('supertest_update')
					object.app_user_object_uid.should.be.equal('system')
					object.updated_by.should.be.not.equal(object.created_by)
					object.created_by.should.be.equal(userUID)
					object.updated_by.should.be.equal(userUID_1)
					object.published.should.be.equal(true)
					object.created_at.should.be.equal(object.updated_at)

					object._version.should.be.equal(2)

					done()
				});

		});

	});


	describe('object revert', function() {
		
		it('should revert object to specific version', function(done) {

			return R.Promisify(factories.create('update_object', authtoken_1, api_key, classUid, objectUid, {
					"object": {
						"name": "supertest_update"
					}
				}))
				.then(function(res) {
					// res.body.object._version.should.be.equal(2)

					var objectId = res.body.object.uid
					return R.Promisify(factories.create('object_revert', authtoken, api_key, classUid, objectUid, tenant_uid, {
						"version": 1
					}))
				})
				.then(function(res1) {

					// R.pretty(res1.body)

					var object = res1.body.object

					// Keys assertion        
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])

					// Data type assertion

					// value assertion
					object.uid.should.be.equal(objectUid)
					object.name.should.be.equal('supertest')
					object.app_user_object_uid.should.be.equal('system')
					object.updated_by.should.be.equal(userUID)
					object.created_by.should.be.equal(userUID)
					object.published.should.be.equal(true)
					object._version.should.be.equal(3)
					// new copy of object is getting created with new verison 
					done()
				});

		});

	});


	



})