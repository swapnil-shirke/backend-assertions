describe('Installation data ---', function() {
	var authtoken, userUID
	var api_key
	var username
	var email
	var appname

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

	after(function(done) {
		factories.create('Delete_application', authtoken, api_key)
			.end(function(err, res1) {
				console.log("application delete")
				done(err)
			})
	})



	describe('Create an installations', function() {
		this.timeout(15000)
		it('should create installation object', function(done) {

			factories.create('Create_Installation_object', authtoken, api_key, {
					"object": {
						"published": true,
						"__loc": null,
						"device_type": "ios",
						"device_token": R.bltRandom(8),
						"subscribed_to_channels": ["object.create", "object.delete"],
						"badge": 1,
						"disable": false,
						"timezone": "+05:30",
						"credentials_name": "swapnil shirke",
						"ACL": {
							"disable": false,
							"others": {
								"read": false,
								"update": false,
								"delete": false
							}
						},
						"tags": [
							"supertest object"
						]
					}
				})
				.expect(201)
				.end(function(err, res) {
					// console.log(res.body)
					var objData = res.body.object
					var id = res.body.object.uid

					res.body.notice.should.be.equal('Woot! Object created successfully.')

					// Keys assertion
					Object.keys(objData).should.to.be.deep.equal(['published', '__loc', 'device_type', 'device_token', 'subscribed_to_channels', 'badge', 'disable', 'timezone', 'credentials_name', 'ACL', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', '_version'])
					objData.subscribed_to_channels[0].should.to.be.deep.equal('object.create')
					objData.subscribed_to_channels[1].should.to.be.deep.equal('object.delete')

					Object.keys(objData.ACL).should.to.be.deep.equal(['disable', 'others'])
					Object.keys(objData.ACL.others).should.to.be.deep.equal(['read', 'update', 'delete'])
					objData.tags.should.to.be.deep.equal(['supertest object'])

					// Data type assertion
					objData.published.should.be.a('boolean')
					objData.device_type.should.be.a('string')
					objData.subscribed_to_channels.should.be.a('array')
					objData.badge.should.be.a('number')
					objData.disable.should.be.a('boolean')
					objData.timezone.should.be.a('string')
					objData.credentials_name.should.be.a('string')
					objData.ACL.should.be.a('object')
					objData._version.should.be.a('number')
					objData.tags.should.be.a('array')
					objData.app_user_object_uid.should.be.a('string')
					objData.created_by.should.be.a('string')
					objData.updated_by.should.be.a('string')
					objData.created_at.should.be.a('string')
					objData.updated_at.should.be.a('string')
					objData.uid.should.be.a('string')


					// Value assertion
					expect(objData.__loc).to.be.equal(null)
					objData.published.should.be.equal(true)
					objData.device_type.should.be.equal('ios')
					objData.subscribed_to_channels[0].should.be.equal('object.create')
					objData.subscribed_to_channels[1].should.be.equal('object.delete')

					objData.badge.should.be.equal(1)
					objData.disable.should.be.equal(false)
					objData.timezone.should.be.equal('+05:30')
					objData.credentials_name.should.be.equal('swapnil shirke')
					objData.ACL.disable.should.be.equal(false)
					objData.ACL.others.read.should.be.equal(false)
					objData.ACL.others.update.should.be.equal(false)
					objData.ACL.others.delete.should.be.equal(false)
					objData._version.should.be.equal(1)
					objData.tags[0].should.be.equal('supertest object')
					objData.app_user_object_uid.should.be.equal('system')
					objData.created_by.should.be.equal(objData.updated_by)
					objData.created_by.should.be.equal(userUID)
					objData.updated_by.should.be.equal(userUID)
					objData.created_at.should.be.equal(objData.updated_at)
					objData.updated_at.should.be.equal(objData.created_at)
					objData.uid.should.be.equal(id)


					done(err)
				})

		});

	})

	// need to add ramdom string
	describe('Get all installations', function() {
		this.timeout(15000)
		it('should get installation objects', function(done) {

			factories.create('Create_Installation_object', authtoken, api_key)
				.expect(201)
				.end(function(err, res) {

					factories.create('Get_Installation_objects', authtoken, api_key)
						.expect(200)
						.end(function(err, res1) {
							// console.log(res1.body)
							var object = res1.body.objects[0]

							Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'device_type', 'device_token', 'subscribed_to_channels', 'badge', 'disable', 'timezone', 'credentials_name', 'ACL', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', '_version'])
							object.subscribed_to_channels[0].should.to.be.deep.equal('object.create')
							object.subscribed_to_channels[1].should.to.be.deep.equal('object.delete')

							Object.keys(object.ACL).should.to.be.deep.equal(['disable', 'others'])
							Object.keys(object.ACL.others).should.to.be.deep.equal(['read', 'update', 'delete'])
							object.tags.should.to.be.deep.equal(['supertest object'])

							// Data type assertion
							object.published.should.be.a('boolean')
							object.device_type.should.be.a('string')
							object.subscribed_to_channels.should.be.a('array')
							object.badge.should.be.a('number')
							object.disable.should.be.a('boolean')
							object.timezone.should.be.a('string')
							object.credentials_name.should.be.a('string')
							object.ACL.should.be.a('object')
							object._version.should.be.a('number')
							object.tags.should.be.a('array')
							object.app_user_object_uid.should.be.a('string')
							object.created_by.should.be.a('string')
							object.updated_by.should.be.a('string')
							object.created_at.should.be.a('string')
							object.updated_at.should.be.a('string')
							object.uid.should.be.a('string')


							// Value assertion
							expect(object.__loc).to.be.equal(null)
							object.published.should.be.equal(true)
							object.device_type.should.be.equal('ios')
							object.subscribed_to_channels[0].should.be.equal('object.create')
							object.subscribed_to_channels[1].should.be.equal('object.delete')

							object.badge.should.be.equal(1)
							object.disable.should.be.equal(false)
							object.timezone.should.be.equal('+05:30')
							object.credentials_name.should.be.equal('swapnil shirke')
							object.ACL.disable.should.be.equal(false)
							object.ACL.others.read.should.be.equal(false)
							object.ACL.others.update.should.be.equal(false)
							object.ACL.others.delete.should.be.equal(false)
							object._version.should.be.equal(1)
							object.tags[0].should.be.equal('supertest object')
							object.app_user_object_uid.should.be.equal('system')
							object.created_by.should.be.equal(object.updated_by)
							object.created_by.should.be.equal(userUID)
							object.created_at.should.be.equal(object.updated_at)
							object.updated_at.should.be.equal(object.created_at)


							done(err)
						})
				})

		});

	})


	describe('Get single object', function() {
		this.timeout(15000)
		it('should get single object', function(done) {
			
			factories.create('Create_Installation_object', authtoken, api_key)
				.expect(201)
				.end(function(err, res) {
					var id = res.body.object.uid
					
					factories.create('Get_Installation_objects', authtoken, api_key, id)
						.expect(200)
						.end(function(err, res1) {
							
							var object = res.body.object

							// Keys assertion
							Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'device_type', 'device_token', 'subscribed_to_channels', 'badge', 'disable', 'timezone', 'credentials_name', 'ACL', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', '_version'])
							object.subscribed_to_channels[0].should.to.be.deep.equal('object.create')
							object.subscribed_to_channels[1].should.to.be.deep.equal('object.delete')

							Object.keys(object.ACL).should.to.be.deep.equal(['disable', 'others'])
							Object.keys(object.ACL.others).should.to.be.deep.equal(['read', 'update', 'delete'])
							object.tags.should.to.be.deep.equal(['supertest object'])

							// Data type assertion
							object.published.should.be.a('boolean')
							object.device_type.should.be.a('string')
							object.subscribed_to_channels.should.be.a('array')
							object.badge.should.be.a('number')
							object.disable.should.be.a('boolean')
							object.timezone.should.be.a('string')
							object.credentials_name.should.be.a('string')
							object.ACL.should.be.a('object')
							object._version.should.be.a('number')
							object.tags.should.be.a('array')
							object.app_user_object_uid.should.be.a('string')
							object.created_by.should.be.a('string')
							object.updated_by.should.be.a('string')
							object.created_at.should.be.a('string')
							object.updated_at.should.be.a('string')
							object.uid.should.be.a('string')


							// Value assertion
							expect(object.__loc).to.be.equal(null)
							object.published.should.be.equal(true)
							object.device_type.should.be.equal('ios')
							object.subscribed_to_channels[0].should.be.equal('object.create')
							object.subscribed_to_channels[1].should.be.equal('object.delete')

							object.badge.should.be.equal(1)
							object.disable.should.be.equal(false)
							object.timezone.should.be.equal('+05:30')
							object.credentials_name.should.be.equal('swapnil shirke')
							object.ACL.disable.should.be.equal(false)
							object.ACL.others.read.should.be.equal(false)
							object.ACL.others.update.should.be.equal(false)
							object.ACL.others.delete.should.be.equal(false)
							object._version.should.be.equal(1)
							object.tags[0].should.be.equal('supertest object')
							object.app_user_object_uid.should.be.equal('system')
							object.created_by.should.be.equal(object.updated_by)
							object.created_by.should.be.equal(userUID)
							object.created_at.should.be.equal(object.updated_at)
							object.updated_at.should.be.equal(object.created_at)

							done(err)
						})
				})
		
		});

	})


	describe('Update an installation', function() {
		this.timeout(15000)
		it('should update installation objects', function(done) {

			factories.create('Create_Installation_object', authtoken, api_key)
				.expect(201)
				.end(function(err, res) {

					var objectID = res.body.object.uid

					factories.create('Update_Installation_object', authtoken, api_key, objectID, {
							"object": {
								"published": true,
								"__loc": null,
								"device_type": "ios",
								"device_token": R.bltRandom(8),
								"subscribed_to_channels": [
									"object.create",
									"object.update"
								],
								"badge": 3,
								"disable": false,
								"timezone": "+05:30",
								"credentials_name": "super test",
								"ACL": {
									"disable": false,
									"others": {
										"read": true,
										"update": true,
										"delete": false
									}
								},
								"tags": [
									"supertest object update"
								]
							}
						})
						.expect(200)
						.end(function(err, res1) {
							//console.log(res1.body)
							res1.body.notice.should.be.equal('Woot! Object updated successfully.')
							var object = res1.body.object

							// Keys assertion
							Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'device_type', 'device_token', 'subscribed_to_channels', 'badge', 'disable', 'timezone', 'credentials_name', 'ACL', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', '_version'])

							object.subscribed_to_channels[0].should.to.be.deep.equal('object.create')
							object.subscribed_to_channels[1].should.to.be.deep.equal('object.update')

							Object.keys(object.ACL).should.to.be.deep.equal(['disable', 'others'])
							Object.keys(object.ACL.others).should.to.be.deep.equal(['read', 'update', 'delete'])
							object.tags.should.to.be.deep.equal(['supertest object update'])

							// Data type assertion
							object.published.should.be.a('boolean')
							object.device_type.should.be.a('string')
							object.subscribed_to_channels.should.be.a('array')
							object.badge.should.be.a('number')
							object.disable.should.be.a('boolean')
							object.timezone.should.be.a('string')
							object.credentials_name.should.be.a('string')
							object.ACL.should.be.a('object')
							object._version.should.be.a('number')
							object.tags.should.be.a('array')
							object.app_user_object_uid.should.be.a('string')
							object.created_by.should.be.a('string')
							object.updated_by.should.be.a('string')
							object.created_at.should.be.a('string')
							object.updated_at.should.be.a('string')
							object.uid.should.be.a('string')


							// Value assertion
							expect(object.__loc).to.be.equal(null)
							object.published.should.be.equal(true)
							object.device_type.should.be.equal('ios')
							object.subscribed_to_channels[0].should.be.equal('object.create')
							object.subscribed_to_channels[1].should.be.equal('object.update')

							object.badge.should.be.equal(3)
							object.disable.should.be.equal(false)
							object.timezone.should.be.equal('+05:30')
							object.credentials_name.should.be.equal('super test')
							object.ACL.disable.should.be.equal(false)
							object.ACL.others.read.should.be.equal(true)
							object.ACL.others.update.should.be.equal(true)
							object.ACL.others.delete.should.be.equal(false)
							object._version.should.be.equal(2)
							object.tags[0].should.be.equal('supertest object update')
							object.app_user_object_uid.should.be.equal('system')
							object.created_by.should.be.equal(object.updated_by)
							object.created_by.should.be.equal(userUID)
							object.created_at.should.not.equal(object.updated_at)
							object.updated_at.should.not.equal(object.created_at)

							done(err)
						})
				})

		});

	})


	describe('Delete an installation', function() {
		this.timeout(15000)
		it('should delete an installation object', function(done) {

			factories.create('Create_Installation_object', authtoken, api_key)
				.expect(201)
				.end(function(err, res) {
					var objectUid = res.body.object.uid

					factories.create('Delete_Installation_object', authtoken, api_key, objectUid)
						.expect(200)
						.end(function(err, res1) {
							res1.body.notice.should.be.equal('Woot! Object deleted successfully.')

							done(err)
						})
				})

		});

	})

})