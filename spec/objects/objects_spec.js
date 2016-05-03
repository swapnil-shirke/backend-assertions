describe('Testing objects', function() {
	
	// var myclass, myclass1
	var sys_user1, sys_user2
	var app
	

	// system user login and create application
  before(function(done) {
  	this.timeout(25000)
  	R.Promisify(factories.create('login_system_user'))
    .then(function(res) {
      sys_user1 = res.body.user
    })
    .then(function(res) {
      return R.Promisify(factories.create('Create_application', sys_user1.authtoken))
    })
    .then(function(res) {
      app = res.body.application
    })
    .then(function(res) {
			return R.Promisify(factories.create('login_system_user', config.user2))
		})
		.then(function(res) {
			sys_user2 = res.body.user
		})
		.then(function(res) {
			return R.Promisify(factories.create('invite_collaborator', sys_user1.authtoken, app.api_key, {
				"emails": [
					sys_user2.email
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
  
  // delete application
  after(function(done) {
    factories.create('Delete_application', sys_user1.authtoken, app.api_key)
      .end(function(err, res) {
        // console.log("application delete")
        done(err)
      })

  })


  describe('Get objects', function() {
 
  	var myclass
  	// create class and create mumtiple objects
  	before(function(done) {
  		this.timeout(25000)
  		R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
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
							"create": true,
							"read": true
						}
					}
				}
			}))
			.then(function(res) {
				myclass = res.body.class
			})
			.then(function(res) {
				return factories.create('create_objects', 5, sys_user1.authtoken, app.api_key, myclass.uid, [{
					name: '1'
				},{
					name: '2'
				},{
					name: '3'
				},{
					name: '4'
				},{
					name: '5'
				}])
			})
			.then(function(res) {
				done()
      })
      .catch(function(err) {
        console.log(err)
      })

  	})

  	it('should get all objects', function(done) {
  		R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass.uid))
  		.then(function(res) {
  			objects = res.body.objects
  			objects.length.should.be.equal(5)
  			done()
  		})

  	});


  	it('should get all objects and limit 1', function(done) {
			R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass.uid, {
				"limit": 1
			}))
  		.then(function(res) {
  			objects = res.body.objects
  			objects.length.should.be.equal(1)
  			done()
  		})  		
  	
  	});


  	it('should get all objects and skip 2', function(done) {
			R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass.uid, {
				"skip": 2
			}))
  		.then(function(res) {
  			objects = res.body.objects
  			objects.length.should.be.equal(3)
  			done()
  		})  		
  	
  	});


  	it('should get all objects skip 2 / limit 1 ', function(done) {
			R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass.uid, {
				"skip": 2,
				"limit": 1
			}))
  		.then(function(res) {
  			objects = res.body.objects
  			objects.length.should.be.equal(1)
  			done()
  		})  		
  	
  	});


  	it('should get only objects count', function(done) {
			R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass.uid, {
				"count": "true"
			}))
  		.then(function(res) {
  			objects = res.body.objects
  			objects.should.be.equal(5)
  			done()
  		})  		
  	
  	});

  	
  	it('should get all objects including schema', function(done) {
			R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass.uid, {
				"include_schema": "false"
			}))
  		.then(function(res) {
  			objects = res.body.objects
  			objects.length.should.be.equal(5)
  			schema = res.body.schema
  			should.exist(schema)
  			schema[0].uid.should.be.equal("name")	
  			done()
  		})  		
  	
  	});

  	
  	it('should get objects and include count', function(done) {
			R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass.uid, {
				"include_count": "true"
			}))
  		.then(function(res) {
  			objects = res.body.objects
  			objects.length.should.be.equal(5)

  			count = res.body.count
  			should.exist(count)
  			count.should.be.equal(5)
  			done()
  		})  		
  	
  	});


  	it('should get objects in ascending order', function(done) {
			R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass.uid, {
				"asc": "name"
			}))
  		.then(function(res) {
  			objects = res.body.objects
  			objects.length.should.be.equal(5)

  			// value assertion
  			objects[0].name.should.be.equal('1')
  			objects[1].name.should.be.equal('2')
  			objects[2].name.should.be.equal('3')
  			objects[3].name.should.be.equal('4')
  			objects[4].name.should.be.equal('5')
  			
  			done()
  		})  		
  	
  	});


  	it('should get objects in descending order', function(done) {
			R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass.uid, {
				"desc": "name"
			}))
  		.then(function(res) {
  			objects = res.body.objects
  			objects.length.should.be.equal(5)

  			// value assertion
  			objects[0].name.should.be.equal('5')
  			objects[1].name.should.be.equal('4')
  			objects[2].name.should.be.equal('3')
  			objects[3].name.should.be.equal('2')
  			objects[4].name.should.be.equal('1')

  			done()
  		})  		
  	
  	});


  });


	describe('Delta queries', function() {
		
		var myclass1
		var object1, object2, object3

  	// create class and create mumtiple objects
  	before(function(done) {
  		this.timeout(25000)
  		R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
				"class": {
					"title": "supertest class2",
					"uid": "supertest_class2",
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
							"create": true,
							"read": true
						}
					}
				}
			}))
			.then(function(res) {
				myclass1 = res.body.class
			})
			.then(function(res) {
				return factories.create('create_objects', 3, sys_user1.authtoken, app.api_key, myclass1.uid, [{
					name: 'one'
				},{
					name: 'two'
				},{
					name: 'three'
				}])
			})
			.then(function(res) {
				return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass1.uid))
			})
			.then(function(res) {
				object1 = res.body.objects[0]
				object2 = res.body.objects[1]
				object3 = res.body.objects[2]
			})
			.then(function(res) {
				return R.Promisify(factories.create('update_object', sys_user2.authtoken, app.api_key, myclass1.uid, object2.uid, {"object": {"name": "updated"}}))
			})
			.then(function(res) {
				return R.Promisify(factories.create('delete_object', sys_user2.authtoken, app.api_key, myclass1.uid, object3.uid))
			})
			.then(function(res) {
				done()
      })
      .catch(function(err) {
        console.log(err)
      })

  	})

  	it('should get all objects using delta ALL query', function(done) {

  		var date = object3.created_at.substr(0, 19)

  		R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass1.uid, {
				"delta": {
					"ALL": date
				}
			}))
  		.then(function(res) {

  			// key assertion
  			Object.keys(res.body.objects).should.to.be.deep.equal(['created_at', 'updated_at', 'deleted_at'])
  			
  			createdAt = res.body.objects.created_at
  			updatedAt = res.body.objects.updated_at
  			deletedAt = res.body.objects.deleted_at
  			
  			res.body.objects.should.be.a('object')
  			
  			createdAt.should.be.a('array')
  			updatedAt.should.be.a('array')
  			deletedAt.should.be.a('array')

  			createdAt.length.should.be.equal(2)
  			updatedAt.length.should.be.equal(2)
  			deletedAt.length.should.be.equal(1)

  			// value assertion

  			createdAt[0].uid.should.be.equal(object2.uid)
  			createdAt[1].uid.should.be.equal(object1.uid)
				
				updatedAt[0].uid.should.be.equal(object2.uid)
				updatedAt[1].uid.should.be.equal(object1.uid)
				
				deletedAt[0].uid.should.be.equal(object3.uid)
  			
				createdAt[0].name.should.be.equal('updated')
  			createdAt[1].name.should.be.equal(object1.name)
				
				updatedAt[0].name.should.be.equal('updated')
				updatedAt[1].name.should.be.equal(object1.name)
				
				deletedAt[0].name.should.be.equal(object3.name)
  			

  			done()
  		})

  	});


  	it('should get all objects by created_at delta query', function(done) {
  		
  		var date = object3.created_at.substr(0, 19)
  		
  		R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass1.uid, {
				"delta": {
					"created_at": object3.created_at.substr(0, 19)
				}
			}))
  		.then(function(res) {
  			// key assertion 
  			Object.keys(res.body.objects).should.to.be.deep.equal(['created_at'])

  			createdAt = res.body.objects.created_at
				
				createdAt.should.be.a('array')
				createdAt.length.should.be.equal(2)
				
				createdAt[0].uid.should.be.equal(object2.uid)
				createdAt[1].uid.should.be.equal(object1.uid)
				
				createdAt[0].name.should.be.equal('updated')
				createdAt[1].name.should.be.equal(object1.name)
  			done()
  		})

  	});


  	it('should get all objects by updated_at delta query', function(done) {
  		
  		var date = object3.created_at.substr(0, 19)

  		R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass1.uid, {
				"delta": {
					"updated_at": object3.created_at.substr(0, 19)
				}
			}))
  		.then(function(res) {
  			
  			Object.keys(res.body.objects).should.to.be.deep.equal(['updated_at'])

  			updatedAt = res.body.objects.updated_at
				
				updatedAt.should.be.a('array')
				updatedAt.length.should.be.equal(2)
				
				updatedAt[0].uid.should.be.equal(object2.uid)
				updatedAt[1].uid.should.be.equal(object1.uid)
				
				updatedAt[0].name.should.be.equal('updated')
				updatedAt[1].name.should.be.equal(object1.name)
  			done()
  		})

  	});


  	it('should get all objects by delete_at delta query', function(done) {
  		
  		var date = object3.created_at.substr(0, 19)
  		
  		R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass1.uid, {
				"delta": {
					"deleted_at": object3.created_at.substr(0, 19)
				}
			}))
  		.then(function(res) {
  			
  			Object.keys(res.body.objects).should.to.be.deep.equal(['deleted_at'])

  			deletedAt = res.body.objects.deleted_at
				
				deletedAt.should.be.a('array')
				deletedAt.length.should.be.equal(1)
				
				deletedAt[0].uid.should.be.equal(object3.uid)
				deletedAt[0].name.should.be.equal('one')
				
  			done()
  		})

  	});


	});

	describe('Object CURD', function() {
		
		var myclass3, tenant, object1

  	// create class and create mumtiple objects
  	before(function(done) {
  		this.timeout(25000)
  		R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
				"class": {
					"title": "supertest class3",
					"uid": "supertest_class3",
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
							"create": true,
							"read": true
						}
					}
				}
			}))
			.then(function(res) {
				myclass3 = res.body.class
			})
			.then(function(res) {
				return R.Promisify(factories.create('Create_tenants', sys_user1.authtoken, app.api_key, {
					"tenant": {
						"uid": "india",
						"name": "india",
						"description": "india tenant is created by supertest"
					}
				}))
			})
			.then(function(res) {
				tenant = res.body.tenant
			})
			.then(function(res) {
				return R.Promisify(factories.create('Create_object', sys_user1.authtoken, app.api_key, myclass3.uid, {
					"object": {
						"name": "one"
					}
				}))
			})
			.then(function(res) {
				object1 = res.body.object
			})
			.then(function(res) {
				done()
      })
      .catch(function(err) {
        console.log(err)
      })

  	})

  	it('should get single object', function(done) {

  		R.Promisify(factories.create('get_object', sys_user1.authtoken, app.api_key, myclass3.uid, object1.uid))
  		.then(function(res) {
  			
  			object = res.body.object

  			Object.keys(object).should.to.be.deep.equal(['name','app_user_object_uid','created_by','updated_by','created_at','updated_at','uid','published','ACL','__loc','_version','tags'])
  			done()
  		})

  	});

  	it('should update object', function(done) {

  		R.Promisify(factories.create('update_object', sys_user1.authtoken, app.api_key, myclass3.uid, object1.uid, {
					"object": {
						"name": "updated"
					}
				}))
  		.then(function(res) {
  			object = res.body.object
  			
  			res.body.notice.should.be.equal('Woot! Object updated successfully.')
  			Object.keys(object).should.to.be.deep.equal(['name','app_user_object_uid','created_by','updated_by','created_at','updated_at','uid','published','ACL','__loc','_version','tags'])
  			done()
  		})

  	});

  	it('should delete object', function(done) {

  		R.Promisify(factories.create('delete_object', sys_user1.authtoken, app.api_key, myclass3.uid, object1.uid))
  		.then(function(res) {
  			// object = res.body.object
  			
  			res.body.notice.should.be.equal('Woot! Object deleted successfully.')
  			
  			done()
  		})

  	});


	});


	describe.skip('Object uniquness', function() {
		
		// create class and create mumtiple objects
  	before(function(done) {
  		this.timeout(25000)
  		R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
				"class": {
					"title": "supertest class3",
					"uid": "supertest_class3",
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
							"create": true,
							"read": true
						}
					}
				}
			}))
			.then(function(res) {
				myclass3 = res.body.class
			})
			.then(function(res) {
				return R.Promisify(factories.create('Create_tenants', sys_user1.authtoken, app.api_key, {
					"tenant": {
						"uid": "india",
						"name": "india",
						"description": "india tenant is created by supertest"
					}
				}))
			})
			.then(function(res) {
				tenant = res.body.tenant
			})
			.then(function(res) {
				return R.Promisify(factories.create('Create_object', sys_user1.authtoken, app.api_key, myclass3.uid, {
					"object": {
						"name": "one"
					}
				}))
			})
			.then(function(res) {
				object1 = res.body.object
			})
			.then(function(res) {
				done()
      })
      .catch(function(err) {
        console.log(err)
      })

  	})		

	});




	
});
