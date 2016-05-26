describe('App user roles ---', function() {

	var sys_user, app
	var roleUid, roleName

	before(function(done) {
		R.Promisify(factories.create('login_system_user'))
		.then(function(res) {
			sys_user = res.body.user
		})
		.then(function(res) {
			return R.Promisify(factories.create('Create_application', sys_user.authtoken))
		})
		.then(function(res) {
			app = res.body.application
		})
		.then(function(res) {
    	return factories.create('create_objects', 2, sys_user.authtoken, app.api_key, 'built_io_application_user', [{
				"published": true,
				"active": true,
				"username": "userOne",
				"email": "userOne@mailinator.com",
				"password": "raw123",
				"password_confirmation": "raw123"
			},{
				"published": true,
				"active": true,
				"username": "userTwo",
				"email": "userTwo@mailinator.com",
				"password": "raw123",
				"password_confirmation": "raw123"
			}])
		})
		.then(function(res) {
			return R.Promisify(factories.create('get_all_objects', sys_user.authtoken, app.api_key, 'built_io_application_user'))
		})
		.then(function(res) {
			user1 = res.body.objects[0]
			user2 = res.body.objects[1]
		})
		.then(function(res) {
			return R.Promisify(factories.create('login_app_user', app.api_key, {
			  "application_user": {
			    "email": user1.email,
			    "password": "raw123"
			  }
			}))
		})
		.then(function(res) {
			appUser1 = res.body.application_user
		})
		.then(function(res) {
			return R.Promisify(factories.create('login_app_user', app.api_key, {
			  "application_user": {
			    "email": user2.email,
			    "password": "raw123"
			  }
			}))
		})
		.then(function(res) {
			appUser2 = res.body.application_user
		})
		.then(function(res) {
			done()
		})
		.catch(function(err) {
			console.log(err)
		})

	})

	
	beforeEach(function(done) {
		
		var name = R.bltRandom(8)
		
		factories.create('Create_app_user_role', appUser1.authtoken, app.api_key, {
				"object": {
					"published": true,
					"__loc": [-122.4431164995849, 37.74045209829323],
					"name": name,
					"users": [R.bltRandom(8), R.bltRandom(8)],
					"roles": [R.bltRandom(8), R.bltRandom(8)]
				}
			})
			.end(function(err, res) {
				// R.pretty(res.body)
				roleName = res.body.object.name;
				roleUid = res.body.object.uid;
				done(err)
			})
	
	})


	after(function(done) {

		factories.create('Delete_application', sys_user.authtoken, app.api_key)
			.end(function(err, res1) {
				// console.log("application delete")
				done(err)
			})
	
	})



	describe('Application user roles', function() {
		
		var role1, role2, role3, role4

		
		it('should be able to create application user role', function(done) {
			
			R.Promisify(factories.create('Create_app_user_role', appUser1.authtoken, app.api_key, {
				"object": {
					"published": true,
					"__loc": [-122.4431164995849, 37.74045209829323],
					"name": "createRole",
					"users": [R.bltRandom(8), R.bltRandom(8)],
					"roles": [R.bltRandom(8), R.bltRandom(8)]
				}
			}))
			.then(function(res) {
				
				role1 = res.body.object
				// Keys assertion
				Object.keys(role1).should.to.be.deep.equal(['published', '__loc', 'name', 'users', 'roles', 'app_user_object_uid', 'created_at', 'updated_at', 'uid', 'ACL', '_version', 'created_by', 'updated_by', 'tags'])

				// Data type assertion
				role1.published.should.be.a('boolean')
				role1.__loc.should.be.a('array')
				role1.name.should.be.a('string')
				role1.users.should.be.a('array')
				role1.roles.should.be.a('array')
				role1.app_user_object_uid.should.be.a('string')

				role1.created_at.should.be.a('string')
				role1.updated_at.should.be.a('string')
				role1.uid.should.be.a('string')
				role1.ACL.should.be.a('object')
				role1._version.should.be.a('number')
				role1.tags.should.be.a('array')

				// Value assertion
				role1.published.should.be.equal(true)

				role1.name.should.be.equal("createRole")
				role1.users.should.be.deep.equal([])
				role1.roles.should.be.deep.equal([])
				role1.app_user_object_uid.should.be.equal(appUser1.uid)
				expect(role1.created_by).to.be.null
				expect(role1.created_by).to.be.null

				role1.created_at.should.be.equal(role1.updated_at)
				role1._version.should.be.equal(1)
				
			})
			.then(function(res) {
				return R.Promisify(factories.create('delete_role', appUser1.authtoken, app.api_key, role1.uid))
			})
			.then(function(res) {
				res.body.notice.should.be.equal('Woot! Object deleted successfully.')
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err.trace)
			})

		});


		it('should provide error for invalid role field', function(done) {
			this.timeout(45000)
			R.Promisify(factories.create('Create_app_user_role', appUser1.authtoken, app.api_key, {
				"object": {
					"published": true,
					"__loc": [-122.4431164995849, 37.74045209829323],
					// "name": "createRole",
					"users": [R.bltRandom(8), R.bltRandom(8)],
					"roles": [R.bltRandom(8), R.bltRandom(8)]
				}
			}))
			.then(function(res) {
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "name": [
				      "is a required field"
				    ]
				  }
				})
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})

		});


		it('should be able to get all application user roles created', function(done) {
			
			R.Promisify(factories.create('get_app_user_roles', appUser2.authtoken, app.api_key))
			.then(function(res) {
				
				role2 = res.body.objects[0]

				// Keys assertion
				Object.keys(role2).should.to.be.deep.equal(['published','__loc','name','users','roles','app_user_object_uid','created_at','updated_at','uid','ACL','_version','created_by','updated_by','tags'])

				// Data type assertion
				role2.published.should.be.a('boolean')
				role2.__loc.should.be.a('array')
				role2.name.should.be.a('string')
				role2.users.should.be.a('array')
				role2.roles.should.be.a('array')
				role2.app_user_object_uid.should.be.a('string')
				// role2.created_by.should.be.a('string')
				// role2.updated_by.should.be.a('string')
				role2.created_at.should.be.a('string')
				role2.updated_at.should.be.a('string')
				role2.uid.should.be.a('string')
				role2.ACL.should.be.a('object')
				role2._version.should.be.a('number')
				role2.tags.should.be.a('array')

				// Value assertion
				role2.published.should.be.equal(true)

				role2.name.should.be.equal(roleName)
				role2.users.should.be.deep.equal([])
				role2.roles.should.be.deep.equal([])
				role2.app_user_object_uid.should.be.equal(appUser1.uid)
				expect(role2.created_by).to.be.null
				expect(role2.created_by).to.be.null
				role2.created_at.should.be.equal(role2.updated_at)

				role2._version.should.be.equal(1)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})
		
		});


		it('should be able to get single application user role', function(done) {
			
			R.Promisify(factories.create('get_single_role', appUser1.authtoken, app.api_key, roleUid))
			.then(function(res) {
				
				// R.pretty(res.body)
				
				role3 = res.body.object
				
				// Keys assertion
				Object.keys(role3).should.to.be.deep.equal(['published', '__loc', 'name', 'users', 'roles', 'app_user_object_uid', 'created_at', 'updated_at', 'uid', 'ACL', '_version', 'created_by', 'updated_by', 'tags'])

				// Data type assertion
				role3.published.should.be.a('boolean')
				role3.__loc.should.be.a('array')
				role3.name.should.be.a('string')
				role3.users.should.be.a('array')
				role3.roles.should.be.a('array')
				role3.app_user_object_uid.should.be.a('string')

				role3.created_at.should.be.a('string')
				role3.updated_at.should.be.a('string')
				role3.uid.should.be.a('string')
				role3.ACL.should.be.a('object')
				role3._version.should.be.a('number')
				role3.tags.should.be.a('array')

				// Value assertion
				role3.published.should.be.equal(true)

				role3.name.should.be.equal(roleName)
				role3.users.should.be.deep.equal([])
				role3.roles.should.be.deep.equal([])
				role3.app_user_object_uid.should.be.equal(appUser1.uid)
				expect(role3.created_by).to.be.null
				expect(role3.created_by).to.be.null

				role3.created_at.should.be.equal(role3.updated_at)
				role3._version.should.be.equal(1)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})
		
		});


		it('should be able to update application user role', function(done) {
			R.Promisify(factories.create('update_app_user_role', sys_user.authtoken, app.api_key, roleUid, {
				"object": {
					"published": true,
					"__loc": [-122.4431164995849, 37.74045209829323],
					"name": "updateRole",
					"users": [appUser2.uid],
					"roles": [roleUid]
				}
			}))
			.then(function(res) {
				
				res.body.notice.should.be.equal('Woot! Object updated successfully.')
				role4 = res.body.object

				//Keys assertion
				Object.keys(role4).should.to.be.deep.equal(['published','__loc','name','users','roles','app_user_object_uid','created_at','updated_at','uid','ACL','_version','created_by','updated_by','tags'])

				// Data type assertion
				role4.published.should.be.a('boolean')
				role4.__loc.should.be.a('array')
				role4.name.should.be.a('string')
				role4.users.should.be.a('array')
				role4.roles.should.be.a('array')
				role4.app_user_object_uid.should.be.a('string')
				// role4.created_by.should.be.a('string')
				role4.updated_by.should.be.a('string')
				role4.created_at.should.be.a('string')
				role4.updated_at.should.be.a('string')
				role4.uid.should.be.a('string')
				role4.ACL.should.be.a('object')
				role4._version.should.be.a('number')
				role4.tags.should.be.a('array')

				role4.users.should.be.deep.equal([appUser2.uid])
				role4.roles.should.be.deep.equal([roleUid])
				// Value assertion
				role4.published.should.be.equal(true)

				role4.name.should.be.equal("updateRole")
				// role4.users.should.be.equal('array')
				// role4.roles.should.be.equal('array')
				role4.app_user_object_uid.should.be.equal(appUser1.uid)
				
				// expect(role4.created_by).should.to.be.null
				
				role4.updated_by.should.be.equal(sys_user.uid)
				role4.created_at.should.not.equal(role4.updated_at)
				role4._version.should.be.equal(2)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})

		});


		it('should proide error message for invalid role uid while updating role', function(done) {
			R.Promisify(factories.create('update_app_user_role', sys_user.authtoken, app.api_key, "asd", {
				"object": {
					"published": true,
					"__loc": [-122.4431164995849, 37.74045209829323],
					"name": "updateRole",
					"users": [appUser2.uid],
					"roles": [roleUid]
				}
			}))
			.then(function(res) {
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. The requested object doesn't exist.",
				  "error_code": 141,
				  "errors": {
				    "uid": [
				      "is invalid"
				    ]
				  }
				})
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})

		});


		it('should be able to delete application user role created', function(done) {
			
			R.Promisify(factories.create('Create_app_user_role', appUser1.authtoken, app.api_key, {
				"object": {
					"published": true,
					"__loc": [-122.4431164995849, 37.74045209829323],
					"name": "createRole",
					"users": [R.bltRandom(8), R.bltRandom(8)],
					"roles": [R.bltRandom(8), R.bltRandom(8)]
				}
			}))
			.then(function(res) {
				role5 = res.body.object
				// Keys assertion
				// Object.keys(role5).should.to.be.deep.equal(['published', '__loc', 'name', 'users', 'roles', 'app_user_object_uid', 'created_at', 'updated_at', 'uid', 'ACL', '_version', 'created_by', 'updated_by', 'tags'])
			})
			.then(function(res) {
				return R.Promisify(factories.create('delete_role', appUser1.authtoken, app.api_key, role5.uid))
			})
			.then(function(res) {
				// R.pretty(res.body)
				res.body.notice.should.be.equal('Woot! Object deleted successfully.')
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})

		});


		it('should proide error message for invalid role uid while deleting role', function(done) {
			
			R.Promisify(factories.create('delete_role', appUser1.authtoken, app.api_key, "asd"))
			.then(function(res) {
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. The requested object doesn't exist.",
				  "error_code": 141,
				  "errors": {
				    "uid": [
				      "is invalid"
				    ]
				  }
				})
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})

		});


	})




})