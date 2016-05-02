describe('Application user roles ---', function() {
	var authtoken, userUID
	var api_key
	var username
	var email
	var appname

	var roleName, roleUid

	before(function(done) {

		factories.create('login_system_user')
			.end(function(err, res) {

				authtoken = res.body.user.authtoken;
				userUID   = res.body.user.uid;
				username  = res.body.user.username;
				email     = res.body.user.email;

				done(err)
			})
	})

	before(function(done) {

		factories.create('Create_application', authtoken)
			.end(function(err, res) {
				
				api_key    = res.body.application.api_key;
				master_key = res.body.application.master_key;
				appname    = res.body.application.name;
				appuid     = res.body.application.uid

				done(err)
			})
	})

	beforeEach(function(done) {
		
		var name = R.bltRandom(8)
		
		factories.create('Create_app_user_role', authtoken, api_key, {
				"object": {
					"published": true,
					"__loc": [-122.4431164995849, 37.74045209829323],
					"name": name,
					"users": [R.bltRandom(8), R.bltRandom(8)],
					"roles": [R.bltRandom(8), R.bltRandom(8)]
				}
			})
			.end(function(err, res) {
				roleName = res.body.object.name;
				roleUid = res.body.object.uid;

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


	describe('Create app user roles', function() {

		it('should create application user role', function(done) {
			// need to update
			factories.create('Create_app_user_role', authtoken, api_key, {
					"object": {
						"published": true,
						"__loc": [-122.4431164995849, 37.74045209829323],
						"name": "createRole",
						"users": [R.bltRandom(8), R.bltRandom(8)],
						"roles": [R.bltRandom(8), R.bltRandom(8)]
					}
				})
				.expect(201)
				.end(function(err, res) {

					var role = res.body.object

					// Keys assertion
					Object.keys(role).should.to.be.deep.equal(['published', '__loc', 'name', 'users', 'roles', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'ACL', '_version', 'tags'])

					// Data type assertion
					role.published.should.be.a('boolean')
					role.__loc.should.be.a('array')
					role.name.should.be.a('string')
					role.users.should.be.a('array')
					role.roles.should.be.a('array')
					role.app_user_object_uid.should.be.a('string')
					role.created_by.should.be.a('string')
					role.updated_by.should.be.a('string')
					role.created_at.should.be.a('string')
					role.updated_at.should.be.a('string')
					role.uid.should.be.a('string')
					role.ACL.should.be.a('object')
					role._version.should.be.a('number')
					role.tags.should.be.a('array')

					// Value assertion
					role.published.should.be.equal(true)

					role.name.should.be.equal("createRole")
						// role.users.should.be.equal('array')
						// role.roles.should.be.equal('array')
					role.app_user_object_uid.should.be.equal('system')
					role.created_by.should.be.equal(userUID)
					role.updated_by.should.be.equal(userUID)
					role.created_at.should.be.equal(role.updated_at)


					role._version.should.be.equal(1)
						// role.tags.should.be.equal('array')
					done(err)
				})
		});

	})


	describe('Get application user roles', function() {

		it('should get app user role', function(done) {

			factories.create('get_app_user_roles', authtoken, api_key)
				.expect(200)
				.end(function(err, res) {

					var role = res.body.objects[0]

					// Keys assertion
					Object.keys(role).should.to.be.deep.equal(['published', '__loc', 'name', 'users', 'roles', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'ACL', '_version', 'tags'])

					// Data type assertion
					role.published.should.be.a('boolean')
					role.__loc.should.be.a('array')
					role.name.should.be.a('string')
					role.users.should.be.a('array')
					role.roles.should.be.a('array')
					role.app_user_object_uid.should.be.a('string')
					role.created_by.should.be.a('string')
					role.updated_by.should.be.a('string')
					role.created_at.should.be.a('string')
					role.updated_at.should.be.a('string')
					role.uid.should.be.a('string')
					role.ACL.should.be.a('object')
					role._version.should.be.a('number')
					role.tags.should.be.a('array')

					// Value assertion
					role.published.should.be.equal(true)

					role.name.should.be.equal(roleName)
						// role.users.should.be.equal('array')
						// role.roles.should.be.equal('array')
					role.app_user_object_uid.should.be.equal('system')
					role.created_by.should.be.equal(userUID)
					role.updated_by.should.be.equal(userUID)
					role.created_at.should.be.equal(role.updated_at)


					role._version.should.be.equal(1)
					done(err)
				})
		});

	})


	describe('Get single application role', function() {

		it('should get single role', function(done) {
			
			factories.create('get_single_role', authtoken, api_key, roleUid)
				.expect(200)
				.end(function(err, res1) {

					var role = res1.body.object
					
					// Keys assertion
					Object.keys(role).should.to.be.deep.equal(['published', '__loc', 'name', 'users', 'roles', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'ACL', '_version', 'tags'])

					// Data type assertion
					role.published.should.be.a('boolean')
					role.__loc.should.be.a('array')
					role.name.should.be.a('string')
					role.users.should.be.a('array')
					role.roles.should.be.a('array')
					role.app_user_object_uid.should.be.a('string')
					role.created_by.should.be.a('string')
					role.updated_by.should.be.a('string')
					role.created_at.should.be.a('string')
					role.updated_at.should.be.a('string')
					role.uid.should.be.a('string')
					role.ACL.should.be.a('object')
					role._version.should.be.a('number')
					role.tags.should.be.a('array')

					// Value assertion
					role.published.should.be.equal(true)

					role.name.should.be.equal(roleName)
						// role.users.should.be.equal('array')
						// role.roles.should.be.equal('array')
					role.app_user_object_uid.should.be.equal('system')
					role.created_by.should.be.equal(userUID)
					role.updated_by.should.be.equal(userUID)
					role.created_at.should.be.equal(role.updated_at)


					role._version.should.be.equal(1)
						// role.tags.should.be.equal('array')
					done(err)
				})
		});

	})


	describe('Update app user role', function() {

		it('should update application user role', function(done) {

			factories.create('update_app_user_role', authtoken, api_key, roleUid, {
					"object": {
						"published": false,
						"__loc": [-122.4431164995849, 37.74045209829323],
						"name": "updateRole",
						"users": [],
						"roles": []
					}
				})
				.expect(200)
				.end(function(err, res) {
					
					var role = res.body.object

					//Keys assertion
					Object.keys(role).should.to.be.deep.equal(['published', '__loc', 'name', 'users', 'roles', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'ACL', '_version', 'tags'])

					// Data type assertion
					role.published.should.be.a('boolean')
					role.__loc.should.be.a('array')
					role.name.should.be.a('string')
					role.users.should.be.a('array')
					role.roles.should.be.a('array')
					role.app_user_object_uid.should.be.a('string')
					role.created_by.should.be.a('string')
					role.updated_by.should.be.a('string')
					role.created_at.should.be.a('string')
					role.updated_at.should.be.a('string')
					role.uid.should.be.a('string')
					role.ACL.should.be.a('object')
					role._version.should.be.a('number')
					role.tags.should.be.a('array')

					// Value assertion
					role.published.should.be.equal(false)

					role.name.should.be.equal("updateRole")
						// role.users.should.be.equal('array')
						// role.roles.should.be.equal('array')
					role.app_user_object_uid.should.be.equal('system')
					role.created_by.should.be.equal(userUID)
					role.updated_by.should.be.equal(userUID)
					role.created_at.should.not.equal(role.updated_at)


					role._version.should.be.equal(2)
						// role.tags.should.be.equal('array')
					done(err)
				})
		});

	})


	describe('Delete app user role', function() {

		it('should delete application user role', function(done) {

			factories.create('delete_role', authtoken, api_key, roleUid)
				.expect(200)
				.end(function(err, res) {
					res.body.notice.should.be.equal('Woot! Object deleted successfully.')
					done(err)
				})
		});

	})

})