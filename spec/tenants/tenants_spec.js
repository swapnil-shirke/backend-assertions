// describe('Tenants --- ', function() {
	
// 	var authtoken, userUID
// 	var api_key
// 	var username
// 	var email
// 	var appname

// 	var tenantId, tenantName

	
// 	before(function(done) {
// 		factories.create('login_system_user')
// 			.end(function(err, res) {

// 				authtoken = res.body.user.authtoken;
// 				userUID = res.body.user.uid;
// 				username = res.body.user.username;
// 				email = res.body.user.email;

// 				done(err)
// 			})
	
// 	})

	
// 	before(function(done) {
// 		factories.create('Create_application', authtoken)
// 			.end(function(err, res) {
// 				api_key = res.body.application.api_key;
// 				master_key = res.body.application.master_key;
// 				appname = res.body.application.name;
// 				appuid = res.body.application.uid

// 				//console.log(res.body)
// 				done(err)
// 			})
	
// 	})


// 	before(function(done) {

// 		var name = R.bltRandom(4)
// 		var uid  = R.bltRandom(4)

// 		factories.create('Create_tenants', authtoken, api_key, {
// 				"tenant": {
// 					"uid": uid,
// 					"name": name,
// 					"description": "supertest tenant is created by supertest"
// 				}
// 			})
// 			.end(function(err, res) {
				
// 				tenantId   = res.body.tenant.uid
// 				tenantName = res.body.tenant.name

// 				done(err)
// 			})
	
// 	})


// 	after(function(done) {
// 		factories.create('Delete_application', authtoken, api_key)
// 			.end(function(err, res1) {
// 				// console.log("application delete")
// 				done(err)
// 			})
	
// 	})



// 	describe('Get single tenant', function() {
		
		
// 		it('should be able to get single tenant created for an app', function(done) {

// 			factories.create('Get_single_tenant', authtoken, api_key, tenantId)
// 				.expect(200)
// 				.end(function(err, res1) {

// 					var tenant = res1.body.tenant
// 					var id     = res1.body.tenant.uid

// 					// Keys assertion
// 					Object.keys(tenant).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'description'])

// 					//Data type assertion
// 					tenant.created_at.should.be.a('string')
// 					tenant.updated_at.should.be.a('string')
// 					tenant.uid.should.be.a('string')
// 					tenant.name.should.be.a('string')
// 					tenant.description.should.be.a('string')

// 					// Value assertion
// 					tenant.created_at.should.be.equal(res1.body.tenant.updated_at)

// 					tenant.uid.should.be.equal(tenantId)
// 					tenant.name.should.be.equal(tenantName)
// 					tenant.description.should.be.equal('supertest tenant is created by supertest')

// 					factories.create('delete_tenant', authtoken, api_key, id)
// 						.expect(200)
// 						.end(function(err, res2) {
							
// 							done(err)
// 						})
// 				})

// 		});


// 		it('should provide an error message for invalid tenant uid', function(done) {

// 			factories.create('Get_single_tenant', authtoken, api_key, "asd")
// 				.expect(422)
// 				.end(function(err, res) {
// 					// R.pretty(res.body)
// 					res.body.should.be.deep.equal({
// 					  "error_message": "Bummer. Tenant was not found. Please try again.",
// 					  "error_code": 166,
// 					  "errors": {
// 					    "uid": [
// 					      "is invalid"
// 					    ]
// 					  }
// 					})		
					
// 					done(err)
// 				})

// 		});

// 	})


// 	describe('Create tenants', function() {

// 		it('should be able to create tenants for an app', function(done) {

// 			var tenantId   = "mumbai";
// 			var tenantName = "mumbai";

// 			factories.create('Create_tenants', authtoken, api_key, {
// 					"tenant": {
// 						"uid": tenantId,
// 						"name": tenantName,
// 						"description": "mumbai tenant"
// 					}
// 				})
// 				.expect(201)
// 				.end(function(err, res) {

// 					res.body.notice.should.be.equal('Woot! The tenant was created successfully.')

// 					var tenant = res.body.tenant
// 					var id     = res.body.tenant.uid
// 						// Keys assertion
// 					Object.keys(tenant).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'description'])

// 					//Data type assertion
// 					tenant.created_at.should.be.a('string')
// 					tenant.updated_at.should.be.a('string')
// 					tenant.uid.should.be.a('string')
// 					tenant.name.should.be.a('string')
// 					tenant.description.should.be.a('string')

// 					// Value assertion
// 					tenant.created_at.should.be.equal(res.body.tenant.updated_at)

// 					tenant.uid.should.be.equal(tenantId)
// 					tenant.name.should.be.equal(tenantName)
// 					tenant.description.should.be.equal('mumbai tenant')

// 					factories.create('delete_tenant', authtoken, api_key, id)
// 						.expect(200)
// 						.end(function(err, res1) {
							
// 							done(err)
// 						})

// 				})

// 		});

// 	})


// 	describe('Update tenant', function() {

// 		it('should be able to update created tenant object', function(done) {

// 			factories.create('Create_tenants', authtoken, api_key)
// 				.expect(201)
// 				.end(function(err, res) {

// 					var id = res.body.tenant.uid

// 					factories.create('update_tenant', authtoken, api_key, id, {
// 							"tenant": {
// 								"name": "Kokan",
// 								"description": "Kokan tenant"
// 							}
// 						})
// 						.expect(200)
// 						.end(function(err, res1) {

// 							var id1 = res1.body.tenant.uid
// 							var tenant = res1.body.tenant

// 							res1.body.notice.should.be.equal('Woot! The tenant was updated successfully.')

// 							// Keys assertion
// 							Object.keys(tenant).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'description'])

// 							//Data type assertion
// 							tenant.created_at.should.be.a('string')
// 							tenant.updated_at.should.be.a('string')
// 							tenant.uid.should.be.a('string')
// 							tenant.name.should.be.a('string')
// 							tenant.description.should.be.a('string')

// 							// Value assertion
// 							tenant.created_at.should.not.equal(res1.body.tenant.updated_at)

// 							tenant.uid.should.be.equal(id)
// 							tenant.name.should.be.equal('Kokan')
// 							tenant.description.should.be.equal('Kokan tenant')

// 							factories.create('delete_tenant', authtoken, api_key, id1)
// 								.expect(200)
// 								.end(function(err, res2) {
// 									done(err)
// 								})
// 						})
// 				})
		
// 		});

// 	})

// 	describe('Get all tenants', function() {

// 		it('should be able to get all created tenant as a list', function(done) {
// 			factories.create('Create_tenants', authtoken, api_key, {
// 					"tenant": {
// 						"uid": "supertest",
// 						"name": "supertest",
// 						"description": "Get all tenants"
// 					}
// 				})
// 				.expect(201)
// 				.end(function(err, res) {
					
// 					factories.create('Get_tenants_list', authtoken, api_key)
// 						.expect(200)
// 						.end(function(err, res2) {

// 							var tenants = res2.body.tenants

// 							tenants.length.should.be.equal(1)
// 							// Keys assertion
// 							Object.keys(tenants[0]).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'description'])

// 							//Data type assertion
// 							tenants[0].created_at.should.be.a('string')
// 							tenants[0].updated_at.should.be.a('string')
// 							tenants[0].uid.should.be.a('string')
// 							tenants[0].name.should.be.a('string')
// 							tenants[0].description.should.be.a('string')

// 							// Value assertion
// 							tenants[0].created_at.should.be.equal(res2.body.tenants[0].updated_at)

// 							// tenants[0].uid.should.be.equal('supertest')
// 							// tenants[0].name.should.be.equal('supertest')
// 							// tenants[0].description.should.be.equal('Get all tenants')


// 							done(err)
// 						})
// 				})
		
// 		});

// 	})

// 	describe('Delete tenant', function() {
		
// 		it('should be able to delete created tenant', function(done) {
			
// 			this.timeout(15000)
			
// 			factories.create('Create_tenants', authtoken, api_key)
// 				.expect(201)
// 				.end(function(err, res) {
					
// 					var id = res.body.tenant.uid

// 					factories.create('delete_tenant', authtoken, api_key, id)
// 						.expect(200)
// 						.end(function(err, res1) {
							
// 							res1.body.notice.should.be.equal('Woot! The tenant was deleted successfully.')

// 							done(err)
// 						})
					
// 				});

// 		})

// 	})




// })