describe('Tenants new ---', function() {
	
	var user, app, myTenant 


	before(function(done) {
		R.Promisify(factories.create('login_system_user'))
		.then(function(res) {
			user = res.body.user
		})
		.then(function(res) {
			return R.Promisify(factories.create('Create_application', user.authtoken))
		})
		.then(function(res) {
			app = res.body.application
		})
		.then(function(res) {
			return R.Promisify(factories.create('Create_tenants', user.authtoken, app.api_key, {
				"tenant": {
					"uid": "mytenant",
					"name": "mytenant",
					"description": "supertest tenant is created by supertest"
				}
			}))
		})
		.then(function(res) {
			myTenant = res.body.tenant
		})
		.then(function(res) {
    	return factories.create('create_objects', 2, user.authtoken, app.api_key, 'built_io_application_user', [{
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
			return R.Promisify(factories.create('get_all_objects', user.authtoken, app.api_key, 'built_io_application_user'))
		})
		.then(function(res) {
			user1 = res.body.objects[1]
			user2 = res.body.objects[0]
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


	after(function(done) {
		factories.create('Delete_application', user.authtoken, app.api_key)
			.end(function(err, res1) {
				// console.log("application delete")
				done(err)
			})
	
	})



	describe('Get single tenant', function() {
		
		
		it('should be able to get single tenant created for an app', function(done) {

			factories.create('Get_single_tenant', user.authtoken, app.api_key, myTenant.uid)
				.expect(200)
				.end(function(err, res1) {

					var tenant = res1.body.tenant
					// var id     = res1.body.tenant.uid

					// Keys assertion
					Object.keys(tenant).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'description'])

					//Data type assertion
					tenant.created_at.should.be.a('string')
					tenant.updated_at.should.be.a('string')
					tenant.uid.should.be.a('string')
					tenant.name.should.be.a('string')
					tenant.description.should.be.a('string')

					// Value assertion
					tenant.created_at.should.be.equal(res1.body.tenant.updated_at)

					tenant.uid.should.be.equal(myTenant.uid)
					tenant.name.should.be.equal(myTenant.name)
					tenant.description.should.be.equal('supertest tenant is created by supertest')

					factories.create('delete_tenant', user.authtoken, app.api_key, tenant.uid)
						.expect(200)
						.end(function(err, res2) {
							
							done(err)
						})
				})

		});


		it('should provide an error message for invalid tenant uid', function(done) {

			factories.create('Get_single_tenant', user.authtoken, app.api_key, "asd")
				.expect(422)
				.end(function(err, res) {
					// R.pretty(res.body)
					res.body.should.be.deep.equal({
					  "error_message": "Bummer. Tenant was not found. Please try again.",
					  "error_code": 166,
					  "errors": {
					    "uid": [
					      "is invalid"
					    ]
					  }
					})		
					
					done(err)
				})

		});

	
	})


	describe('Create tenants', function() {

		
		it('should be able to create tenants for an app', function(done) {

			var tenantId   = "mumbai";
			var tenantName = "mumbai";

			factories.create('Create_tenants', user.authtoken, app.api_key, {
					"tenant": {
						"uid": tenantId,
						"name": tenantName,
						"description": "mumbai tenant"
					}
				})
				.expect(201)
				.end(function(err, res) {

					res.body.notice.should.be.equal('Woot! The tenant was created successfully.')

					var tenant = res.body.tenant
					var id     = res.body.tenant.uid
						// Keys assertion
					Object.keys(tenant).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'description'])

					//Data type assertion
					tenant.created_at.should.be.a('string')
					tenant.updated_at.should.be.a('string')
					tenant.uid.should.be.a('string')
					tenant.name.should.be.a('string')
					tenant.description.should.be.a('string')

					// Value assertion
					tenant.created_at.should.be.equal(res.body.tenant.updated_at)

					tenant.uid.should.be.equal(tenantId)
					tenant.name.should.be.equal(tenantName)
					tenant.description.should.be.equal('mumbai tenant')

					factories.create('delete_tenant', user.authtoken, app.api_key, id)
						.expect(200)
						.end(function(err, res1) {
							// R.pretty(res1.body)
							done(err)
						})

				})

		});


		it('should provide an error message when auto_create_tenants setting is false', function(done) {
			
			var tenantId   = "virar";
			var tenantName = "virar";

			factories.create('Create_tenants', '', app.api_key, {
					"tenant": {
						"uid": tenantId,
						"name": tenantName,
						"description": "mumbai tenant"
					}
				})
				.expect(401)
				.end(function(err, res) {
					
					res.body.should.be.deep.equal({
					  "error_message": "Hey! You're not allowed in here unless you're logged in.",
					  "error_code": 105,
					  "errors": {}
					})
					
					done(err)
				
				})

		});


		it('should provide an error message for unique tenant name', function(done) {

			factories.create('Create_tenants', user.authtoken, app.api_key, {
					"tenant": {
						"name": "Kokan",
						"uid": "Kokan",
						"description": "Kokan tenant"
					}
				})
				.expect(201)
				.end(function(err, res) {

					var id = res.body.tenant.uid

					factories.create('Create_tenants', user.authtoken, app.api_key, {
							"tenant": {
								"name": "Kokan",
								"uid": "Kokan"
							}
						})
						.expect(422)
						.end(function(err, res1) {
							res1.body.should.be.deep.equal({
							  "error_message": "Bummer. Tenant creation failed. Please try again.",
							  "error_code": 164,
							  "errors": {
							    "uid": [
							      "is not unique"
							    ]
							  }
							})

							done(err)
						})
				})
		
		});


	})

	
	describe('Update tenant', function() {

		it('should be able to update created tenant object', function(done) {

			factories.create('Create_tenants', user.authtoken, app.api_key)
				.expect(201)
				.end(function(err, res) {

					var id = res.body.tenant.uid

					factories.create('update_tenant', user.authtoken, app.api_key, id, {
							"tenant": {
								"name": "Kokan",
								"description": "Kokan tenant"
							}
						})
						.expect(200)
						.end(function(err, res1) {

							var id1 = res1.body.tenant.uid
							var tenant = res1.body.tenant

							res1.body.notice.should.be.equal('Woot! The tenant was updated successfully.')

							// Keys assertion
							Object.keys(tenant).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'description'])

							//Data type assertion
							tenant.created_at.should.be.a('string')
							tenant.updated_at.should.be.a('string')
							tenant.uid.should.be.a('string')
							tenant.name.should.be.a('string')
							tenant.description.should.be.a('string')

							// Value assertion
							tenant.created_at.should.not.equal(res1.body.tenant.updated_at)

							tenant.uid.should.be.equal(id)
							tenant.name.should.be.equal('Kokan')
							tenant.description.should.be.equal('Kokan tenant')

							factories.create('delete_tenant', user.authtoken, app.api_key, id1)
								.expect(200)
								.end(function(err, res2) {
									// R.pretty(res2.body)
									done(err)
								})
						})
				})
		
		});


		it('should provide an error message when app user updates tenant object', function(done) {

			factories.create('Create_tenants', user.authtoken, app.api_key)
				.expect(201)
				.end(function(err, res) {

					var id = res.body.tenant.uid

					factories.create('update_tenant', appUser1.authtoken, app.api_key, id, {
							"tenant": {
								"name": "Kokan",
								"description": "Kokan tenant"
							}
						})
						.expect(401)
						.end(function(err, res1) {
							
							res1.body.should.be.deep.equal({
								  "error_message": "Hey! You're not allowed in here unless you're logged in.",
								  "error_code": 105,
								  "errors": {}
								})
							
							factories.create('delete_tenant', user.authtoken, app.api_key, id)
								.expect(200)
								.end(function(err, res2) {
									// R.pretty(res2.body)
									done(err)
								})

						})
				})
		
		});


	})


	describe('Get all tenants', function() {

		it('should be able to get all created tenant as a list', function(done) {
			factories.create('Create_tenants', user.authtoken, app.api_key, {
					"tenant": {
						"uid": "supertest",
						"name": "supertest",
						"description": "Get all tenants"
					}
				})
				.expect(201)
				.end(function(err, res) {
					
					factories.create('Get_tenants_list', user.authtoken, app.api_key)
						.expect(200)
						.end(function(err, res2) {
							// R.pretty(res2.body)
							var tenants = res2.body.tenants

							tenants.length.should.be.equal(2)
							// Keys assertion
							Object.keys(tenants[0]).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'description'])

							//Data type assertion
							tenants[0].created_at.should.be.a('string')
							tenants[0].updated_at.should.be.a('string')
							tenants[0].uid.should.be.a('string')
							tenants[0].name.should.be.a('string')
							tenants[0].description.should.be.a('string')

							// Value assertion
							tenants[0].created_at.should.be.equal(res2.body.tenants[0].updated_at)

							// tenants[0].uid.should.be.equal('supertest')
							// tenants[0].name.should.be.equal('supertest')
							// tenants[0].description.should.be.equal('Get all tenants')


							done(err)
						})
				})
		
		});

	})


	describe('Delete tenant', function() {
		
		it('should be able to delete created tenant', function(done) {
			
			factories.create('Create_tenants', user.authtoken, app.api_key)
				.expect(201)
				.end(function(err, res) {
					
					var id = res.body.tenant.uid

					factories.create('delete_tenant', user.authtoken, app.api_key, id)
						.expect(200)
						.end(function(err, res1) {
							// R.pretty(res1.body)
							res1.body.notice.should.be.equal('Woot! The tenant was deleted successfully.')

							done(err)
						})
					
				});

		})

	})


});