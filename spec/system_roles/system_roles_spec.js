describe('System roles --- ', function() {
	var authtoken, userUID
	var api_key
	var username
	var email
	var appname
	var appuid

	
	before(function(done) {
		factories.create('login_system_user')
			.end(function(err, res) {
				//console.log(res.body)

				authtoken = res.body.user.authtoken;
				userUID = res.body.user.uid;
				username = res.body.user.username;
				email = res.body.user.email;

				done(err)
			})
	})

	before(function(done) {
		factories.create('Create_application', authtoken)
			.end(function(err, res) {
				api_key = res.body.application.api_key;
				master_key = res.body.application.master_key;
				appname = res.body.application.name;
				appuid = res.body.application.uid

				//console.log(res.body)
				done(err)
			})
	})

	after(function(done) {
		factories.create('Delete_application', authtoken, api_key)
			.end(function(err, res1) {
				console.log("application delete")
				done(err)
			})
	})


	describe('Create an system roles', function() {

		it('should create a system roles', function(done) {
			factories.create('Create_system_role', authtoken, api_key, {
					"name": "role_test"
				})
				.end(function(err, res) {
					var role = res.body.system_role
						//console.log(res.body)

					// Keys assertion
					Object.keys(role).should.to.be.deep.equal(['uid', 'name', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL'])
					Object.keys(role.application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'master_key'])

					res.body.notice.should.be.equal('Woot! The group was created successfully.')

					//Data type assertion
					role.uid.should.be.a('string')
					role.name.should.be.a('string')

					role.users.should.be.a('array')
					role.roles.should.be.a('array')

					role.created_at.should.be.a('string')
					role.updated_at.should.be.a('string')
					role.owner.should.be.a('string')

					role.application.should.be.a('object')
					role.SYS_ACL.should.be.a('object')

					role.uid.length.should.be.equal(19)

					role.application.created_at.should.be.a('string')
					role.application.updated_at.should.be.a('string')
					role.application.uid.should.be.a('string')
					role.application.name.should.be.a('string')
					role.application.api_key.should.be.a('string')
					role.application.owner_uid.should.be.a('string')
					role.application.user_uids.should.be.a('array')
					role.application.master_key.should.be.a('string')

					role.application.user_uids[0].should.be.a('string')

					// Value assertion

					role.name.should.be.equal('role_test')
					role.owner.should.be.equal(email)
						// bug
						//role.application.created_at.should.be.equal(role.application.updated_at)

					role.application.uid.should.be.equal(appuid)

					role.application.name.should.be.equal(appname)
					role.application.api_key.should.be.equal(api_key)
					role.application.owner_uid.should.be.equal(userUID)
					role.application.user_uids[0].should.be.equal(userUID)
					role.application.master_key.should.be.equal(master_key)

					done(err)
				})
		});

	});

	describe('Get system_roles', function() {

		it('should get all system roles', function(done) {
			factories.create('Create_system_role', authtoken, api_key, {
					"name": "dev manager"
				})
				.expect(201)
				.end(function(err, res) {
					var role1 = res.body.system_role.name

					factories.create('Create_system_role', authtoken, api_key, {
							"name": "content manager"
						})
						.expect(201)
						.end(function(err, res1) {
							var role2 = res1.body.system_role.name

							factories.create('Get_system_roles', authtoken, api_key)
								.expect(200)
								.end(function(err, res3) {
									var allroles = res3.body.system_roles

									// Keys assertion
									Object.keys(allroles[0]).should.to.be.deep.equal(['uid', 'name', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL'])
									Object.keys(allroles[0]).should.to.be.deep.equal(['uid', 'name', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL'])
									Object.keys(allroles[0].application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'master_key'])

									//Data type assertion


									allroles[0].uid.should.be.a('string')
									allroles[0].name.should.be.a('string')

									allroles[0].users.should.be.a('array')
									allroles[0].roles.should.be.a('array')

									allroles[0].created_at.should.be.a('string')
									allroles[0].updated_at.should.be.a('string')
									allroles[0].owner.should.be.a('string')

									allroles[0].application.should.be.a('object')
									allroles[0].SYS_ACL.should.be.a('object')

									allroles[0].uid.length.should.be.equal(19)

									allroles[0].application.created_at.should.be.a('string')
									allroles[0].application.updated_at.should.be.a('string')
									allroles[0].application.uid.should.be.a('string')
									allroles[0].application.name.should.be.a('string')
									allroles[0].application.api_key.should.be.a('string')
									allroles[0].application.owner_uid.should.be.a('string')
									allroles[0].application.user_uids.should.be.a('array')
									allroles[0].application.master_key.should.be.a('string')

									allroles[0].application.user_uids[0].should.be.a('string')

									// Value assertion

									allroles[0].name.should.be.equal('role_test')
									allroles[0].owner.should.be.equal(email)
										// bug
										//allroles[0].application.created_at.should.be.equal(allroles[0].application.updated_at)

									allroles[0].application.uid.should.be.equal(appuid)

									allroles[0].application.name.should.be.equal(appname)
									allroles[0].application.api_key.should.be.equal(api_key)
									allroles[0].application.owner_uid.should.be.equal(userUID)
									allroles[0].application.user_uids[0].should.be.equal(userUID)
									allroles[0].application.master_key.should.be.equal(master_key)

									done(err)
								})

						})


				})
		});

	});


	describe('Get single system role', function() {

		it('should get single system_role', function(done) {
			factories.create('Create_system_role', authtoken, api_key, {
					"name": "supertest"
				})
				.end(function(err, res) {

					var role_uid = res.body.system_role.uid


					factories.create('Get_single_role', authtoken, api_key, role_uid)
						// .expect(200)
						.end(function(err, res1) {

							var roleobject = res1.body.system_role

							// Keys assertion
							Object.keys(roleobject).should.to.be.deep.equal(['uid', 'name', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL'])
							Object.keys(roleobject).should.to.be.deep.equal(['uid', 'name', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL'])
							Object.keys(roleobject.application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'master_key'])

							// Data type assertion

							roleobject.uid.should.be.a('string')
							roleobject.name.should.be.a('string')

							roleobject.users.should.be.a('array')
							roleobject.roles.should.be.a('array')

							roleobject.created_at.should.be.a('string')
							roleobject.updated_at.should.be.a('string')
							roleobject.owner.should.be.a('string')

							roleobject.application.should.be.a('object')
							roleobject.SYS_ACL.should.be.a('object')

							roleobject.uid.length.should.be.equal(19)

							roleobject.application.created_at.should.be.a('string')
							roleobject.application.updated_at.should.be.a('string')
							roleobject.application.uid.should.be.a('string')
							roleobject.application.name.should.be.a('string')
							roleobject.application.api_key.should.be.a('string')
							roleobject.application.owner_uid.should.be.a('string')
							roleobject.application.user_uids.should.be.a('array')
							roleobject.application.master_key.should.be.a('string')

							roleobject.application.user_uids.should.be.a('array')

							// Value assertion

							roleobject.name.should.be.equal('supertest')
							roleobject.owner.should.be.equal(email)
								// bug
								//roleobject.application.created_at.should.be.equal(roleobject.application.updated_at)

							roleobject.application.uid.should.be.equal(appuid)

							roleobject.application.name.should.be.equal(appname)
							roleobject.application.api_key.should.be.equal(api_key)
							roleobject.application.owner_uid.should.be.equal(userUID)
							roleobject.application.user_uids[0].should.be.equal(userUID)
							roleobject.application.master_key.should.be.equal(master_key)

							done(err)

						});
				});
		});

	});


	describe('Update system role', function() {

		it('should update system role', function(done) {
			factories.create('Create_system_role', authtoken, api_key, {
					"name": "managers"
				})
				.expect(201)
				.end(function(err, res1) {
					var role_uid = res1.body.uid

					factories.create('Update_system_role', authtoken, api_key, role_uid, {
							"name": "developers"
						})
						.expect(200)
						.end(function(err, res2) {

							var updatedRole = res2.body.system_role

							res2.body.notice.should.be.equal('Woot! The group was updated successfully.')

							Object.keys(updatedRole).should.to.be.deep.equal(['uid', 'name', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL'])
							Object.keys(updatedRole).should.to.be.deep.equal(['uid', 'name', 'users', 'roles', 'created_at', 'updated_at', 'owner', 'application', 'SYS_ACL'])
							Object.keys(updatedRole.application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'master_key'])

							//Data type assertion

							updatedRole.uid.should.be.a('string')
							updatedRole.name.should.be.a('string')

							updatedRole.users.should.be.a('array')
							updatedRole.roles.should.be.a('array')

							updatedRole.created_at.should.be.a('string')
							updatedRole.updated_at.should.be.a('string')
							updatedRole.owner.should.be.a('string')

							updatedRole.application.should.be.a('object')
							updatedRole.SYS_ACL.should.be.a('object')

							updatedRole.uid.length.should.be.equal(19)

							updatedRole.application.created_at.should.be.a('string')
							updatedRole.application.updated_at.should.be.a('string')
							updatedRole.application.uid.should.be.a('string')
							updatedRole.application.name.should.be.a('string')
							updatedRole.application.api_key.should.be.a('string')
							updatedRole.application.owner_uid.should.be.a('string')
							updatedRole.application.user_uids.should.be.a('array')
							updatedRole.application.master_key.should.be.a('string')

							updatedRole.application.user_uids[0].should.be.a('string')

							// Value assertion

							updatedRole.name.should.be.equal('developers')
							updatedRole.owner.should.be.equal(email)
								// bug
								//updatedRole.application.created_at.should.be.equal(updatedRole.application.updated_at)

							updatedRole.application.uid.should.be.equal(appuid)

							updatedRole.application.name.should.be.equal(appname)
							updatedRole.application.api_key.should.be.equal(api_key)
							updatedRole.application.owner_uid.should.be.equal(userUID)
							updatedRole.application.user_uids[0].should.be.equal(userUID)
							updatedRole.application.master_key.should.be.equal(master_key)

							done(err)
						})

				})
		});

	});

	describe('Delete system role', function() {

		it('should delete a system role', function(done) {
			factories.create('Create_system_role', authtoken, api_key, {
					"name": "clients"
				})
				.expect(201)
				.end(function(err, res1) {
					var role_uid = res1.body.uid

					factories.create('delete_system_role', authtoken, api_key, role_uid, {
							"name": "developers"
						})
						.expect(200)
						.end(function(err, res2) {

							//var updatedRole = res2.body.system_role
							res2.body.notice.should.be.equal('Woot! The group was deleted successfully.')

							done(err)
						})

				})
		});

	});



});