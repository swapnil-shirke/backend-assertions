describe('Objects metadata --- ', function() {
	
	var authtoken, userUID
	var api_key
	var username
	var email
	var appname
	
	var classUid
	var objectUid



	before(function(done) {
		this.timeout(10000)

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
							"data_type": "text",
							"unique": "local"
						}]
					}
				}))
			})
			.then(function(res) {
				classUid = res.body.class.uid
			})
			.then(function(res) {
				return R.Promisify(factories.create('Create_object', authtoken, api_key, classUid, {
					"object": {
						"name": "supertest"
					}
				}))
			})
			.then(function(res) {
				objectUid = res.body.object.uid
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



	describe('Create metadata (POST call)', function() {

		it('should be able to ignore metadata field while creating object', function(done) {
			factories.create('Create_object', authtoken, api_key, classUid, {
					"object": {
						"name": "metadata object",
						"metadata": {
							"name": "supertest metadata create",
							"isAtool": true,
							"environment": {
								"dev": "new server",
								"stag": "old server"
							}
						}
					}
				})
				.expect(201)
				.end(function(err, res) {
					// R.pretty(res.body)
					var object = res.body.object

					res.body.notice.should.be.equal('Woot! Object created successfully.')

					// Keys assertion
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])

					done(err)
				})

		});

		// bug(no error message provided, it creates object without metadata) 
		it('should be able to ignore _metadata field while creating object', function(done) {
			factories.create('Create_object', authtoken, api_key, classUid, {
					"object": {
						"name": "_metadata object",
						"_metadata": {
							"name": "supertest metadata create",
							"isAtool": true,
							"environment": {
								"dev": "new server",
								"stag": "old server"
							}
						}
					}
				})
				.expect(201)
				.end(function(err, res) {
					object = res.body.object
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])

					done(err)
				})

		});

	
	});


	describe('Update object with metadata (PUT call)', function() {
		// bug
		it('should be able to ignore metadata field while updating object', function(done) {
			factories.create('update_object', authtoken, api_key, classUid, objectUid, {
					"object": {
						"name": "supertest",
						"metadata": {
							"$inc": {
								"increment": 2
							}
						}
					}
				})
				.expect(200)
				.end(function(err, res) {
					var object = res.body.object

					res.body.notice.should.be.equal('Woot! Object updated successfully.')

					// Keys assertion
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])
					done(err)
				})

		});

		it('should be able to provide error message for _metadata field while updating object', function(done) {
			factories.create('update_object', authtoken, api_key, classUid, objectUid, {
					"object": {
						"name": "isupertest",
						"_metadata": {
							"$inc": {
								"increment": 2
							}
						}
					}
				})
				.expect(200)
				.end(function(err, res) {
					R.pretty(res.body)
					object = res.body.object
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])
					
					done(err)
				})

		});

	})


	describe('Update object with metadata (/metadata PUT call)', function() {
		// bug
		it('should update object with metadata', function(done) {
			factories.create('update_metadata', authtoken, api_key, classUid, objectUid, {
					"metadata": [{
						"$inc": {
							"increment": 2
						}
					}, {
						"$set": {
							"name": "supertest metadata update",
							"multiple": 4
						}
					}]
				})
				.expect(200)
				.end(function(err, res) {
					
					var object = res.body.object

					res.body.notice.should.be.equal('Woot! Object updated successfully.')

					// Keys assertion
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags','_metadata'])
					Object.keys(object._metadata).should.to.be.deep.equal(['increment','name','multiple'])

					// Data type assertion
					object._metadata.should.be.a('object')
					object._metadata.increment.should.be.a('number')
					object._metadata.name.should.be.a('string')
					object._metadata.multiple.should.be.a('number')

					// Value assertion
					object._metadata.name.should.be.equal('supertest metadata update')
					object._metadata.multiple.should.be.equal(4)
					object._metadata.increment.should.be.equal(2)

						factories.create('update_metadata', authtoken, api_key, classUid, objectUid, {
							"metadata": [{
								"$inc": {
									"increment": 2
								}
							}, {
								"$mul": {
									"multiple": 4
								}
							}]
						})
						.expect(200)
						.end(function(err, res1) {

							var object = res1.body.object

							res.body.notice.should.be.equal('Woot! Object updated successfully.')

							// Keys assertion
							Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags','_metadata'])
							Object.keys(object._metadata).should.to.be.deep.equal(['increment','name','multiple'])

							// Data type assertion
							object._metadata.should.be.a('object')
							object._metadata.increment.should.be.a('number')
							object._metadata.name.should.be.a('string')
							object._metadata.multiple.should.be.a('number')

							// Value assertion
							object._metadata.name.should.be.equal('supertest metadata update')
							object._metadata.increment.should.be.equal(4)
							object._metadata.multiple.should.be.equal(16)

							done(err)
						})

				})

		});

		it('should provide error message for _metadata field while updating object', function(done) {
			factories.create('update_metadata', authtoken, api_key, classUid, objectUid, {
					"_metadata": [{
						"$inc": {
							"increment": 2
						}
					}, {
						"$set": {
							"name": "supertest metadata update",
							"multiple": 4
						}
					}]
				})
				.expect(422)
				.end(function(err, res) {
					res.body.error_message.should.be.equal("Please send your attributes wrapped in 'metadata'")
					res.body.error_code.should.be.equal(141)

					done(err)
				})

		});

	})



})