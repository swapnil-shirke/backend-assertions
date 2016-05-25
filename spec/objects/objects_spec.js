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
					}, {
						name: '2'
					}, {
						name: '3'
					}, {
						name: '4'
					}, {
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
					}, {
						name: 'two'
					}, {
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
					return R.Promisify(factories.create('update_object', sys_user2.authtoken, app.api_key, myclass1.uid, object2.uid, {
						"object": {
							"name": "updated"
						}
					}))
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

		var myclass3, object1

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

					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])
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
					Object.keys(object).should.to.be.deep.equal(['name', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'tags'])
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


	describe('Object update operations', function() {
		
		var myclass7, object

		before(function(done) {
			this.timeout(45000)
			R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
				"class": {
						"uid": "points",
						"title": "points",
						"schema": [{
							"uid": "roundone",
							"data_type": "group",
							"display_name": "roundone",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							},
							"schema": [{
								"uid": "hits",
								"data_type": "number",
								"display_name": "hits",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": true,
								"format": "",
								"unique": null,
								"action": "add",
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								}
							}, {
								"uid": "name",
								"data_type": "text",
								"display_name": "name",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": false,
								"format": "",
								"unique": "global",
								"action": "add",
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								}
							}]
						}]
					}
				}))
				.then(function(res) {
					myclass7 = res.body.class
				})
				.then(function(res) {
		    	return factories.create('create_objects', 2, sys_user1.authtoken, app.api_key, 'built_io_application_user', [{
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
					return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, 'built_io_application_user'))
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
					return R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, myclass7.uid, {
						"object": {
							"roundone": {
								"hits": ["1", "2", "3", "4", "5"],
								"name": "supertest"
							}
						}
					}))
				})
				.then(function(res) {
					object = res.body.object
				})
				.then(function(res) {
					done()
				})
				.catch(function(err) {
					console.log(err)
				})

		})


		describe('PUSH-PULL', function() {

			
			it('should give error message for -ve index key', function(done) {
				
				var objUid = object.uid 
	 			
				R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
					"object": {
						"roundone.hits": {
							"PUSH": {
								"data": "888",
								"index": -6
							}
						}
					}
				}))
				.then(function(res) {
					res.body.should.be.deep.equal({
					  "error_message": "Bummer. Object update failed. Please enter valid data.",
					  "error_code": 121,
					  "errors": {
					    "Invalid parameters": [
					      "have invalid update operation(s). Please check if they were performed on null values."
					    ]
					  }
					})
				})
				.then(function(res) {
					done()
				})
			

			});

			
			it.skip('should be able to PUSH value (object property) in array field present in group', function(done) {
				
				var objUid = object.uid 
	 			
				R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
					"object": {
						"roundone": {
							"hits": {
								"PUSH": {
									"data": "1222222",
									"index": 1
								}
							}
						}
					}
				}))
				.then(function(res) {
					res.body.should.be.deep.equal({
					  "error_message": "Bummer. Object update failed. Please enter valid data.",
					  "error_code": 121,
					  "errors": {
					    "Invalid parameters": [
					      "have invalid update operation(s). Please check if they were performed on null values."
					    ]
					  }
					})
				})
				.then(function(res) {
					done()
				})
			

			});


			it.skip('should able to PUSH value (object property) in array field present in group without pasing index', function(done) {
				
				var objUid = object.uid 
	 			
				R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
					"object": {
						"roundone": {
							"hits": {
								"PUSH": {
									"data": 555
								}
							}
						}
					}
				}))
				.then(function(res) {
					done()
				})
			

			});


			it('should able to PUSH value(dot property) in array field present in group', function(done) {
				
				var objUid = object.uid 
	 			
				R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
					"object": {
						"roundone.hits": {
							"PUSH": {
								"data": "666",
								"index": 0
							}
						}
					}
				}))
				.then(function(res) {
					object = res.body.object
					res.body.notice.should.be.equal('Woot! Object updated successfully.')
					// object.roundone.hits.should.have.length(6)
					object.roundone.hits[0].should.be.equal(666)
				})
				.then(function(res) {
					done()
				})
			

			});


			it('should give error for field validation for PUSH operation', function(done) {
				
				var objUid = object.uid 
	 			
				R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
					"object": {
						"roundone.hits": {
							"PUSH": {
								"data": "supertest",
								"index": 2
							}
						}
					}
				}))
				.then(function(res) {
					res.body.should.be.deep.equal({
					  "error_message": "Bummer. Object update failed. Please enter valid data.",
					  "error_code": 121,
					  "errors": {
					    "roundone.hits.0": [
					      "is not number"
					    ]
					  }
					})					
				})
				.then(function(res) {
					done()
				})
			

			});


			it('should able to PUSH value(dot property) without passing index', function(done) {
				
				var objUid = object.uid 
	 			
				R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
					"object": {
						"roundone.hits": {
							"PUSH": {
								"data": 999
							}
						}
					}
				}))
				.then(function(res) {
					res.body.notice.should.be.equal('Woot! Object updated successfully.')
					object = R.last(res.body.object.roundone.hits)
					object.should.be.equal(999)
				})
				.then(function(res) {
					done()
				})
			

			});


			it('should able to create object and PUSH values in it', function(done) {
				
				var objUid = object.uid 
	 			
				R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, myclass7.uid, {
					"object": {
						"roundone": {
							"hits": {
								"PUSH": {
									"data": "555"
								}
							}
						}
					}
				}))
				.then(function(res) {
					res.body.notice.should.be.equal('Woot! Object created successfully.')
					object = res.body.object.roundone.hits[0]
					object.should.be.equal(555)
				})
				.then(function(res) {
					done()
				})
			

			});

			it.skip('should provide error message when "data" key is not present', function(done) {
				
				var objUid = object.uid 
	 			
				R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, myclass7.uid, {
					"object": {
						"roundone": {
							"hits": {
								"PUSH": [786]
							}
						}
					}
				}))
				.then(function(res) {
					R.pretty(res.body)
					// res.body.notice.should.be.equal('Woot! Object created successfully.')
					// object = res.body.object.roundone.hits[0]
					// object.should.be.equal(555)
				})
				.then(function(res) {
					done()
				})
			

			});


			it.skip('should able to create object and PUSH values in it using dot property', function(done) {
				
				var objUid = object.uid 
	 			
				R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, myclass7.uid, {
					"object": {
						"roundone.hits": {
							"PUSH": {
								"data": 777
							}
						}
					}
				}))
				.then(function(res) {
					R.pretty(res.body)
					// res.body.notice.should.be.equal('Woot! Object created successfully.')
					// object = res.body.object.roundone.hits[0]
					// object.should.be.equal(555)
				})
				.then(function(res) {
					done()
				})
			

			});


			//----------------------------------------------



			it('should be able to PULL value(object property) from array while updating object', function(done) {
				
	 			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, myclass7.uid, {
					"object": {
						"roundone": {
							"hits": ["101", "102", "103", "104", "105"],
							"name": "supertest1"
						}
					}
				}))
	 			.then(function(res) {
	 				objUid = res.body.object.uid
	 			})
	 			.then(function(res) {
	 				return R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
						"object": {
							"roundone": {
								"hits": {
									"PULL": {
										"data": 105
									}
								}
							}
						}
					}))	
	 			})
				.then(function(res) {
					R.pretty(res.body)
					res.body.notice.should.be.equal('Woot! Object updated successfully.')
					object = res.body.object
					object.roundone.hits.should.be.deep.equal([101, 102, 103, 104])
				})
				.then(function(res) {
					done()
				})
			

			});


			it('should be able to PULL multiple values(object property) from array while updating object', function(done) {
				
	 			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, myclass7.uid, {
					"object": {
						"roundone": {
							"hits": ["201", "202", "203", "204", "205"],
							"name": "supertest2"
						}
					}
				}))
	 			.then(function(res) {
	 				objUid = res.body.object.uid
	 			})
	 			.then(function(res) {
	 				return R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
						"object": {
							"roundone": {
								"hits": {
									"PULL": {
										"data": [201, 202, 203, 204, 205]
									}
								}
							}
						}
					}))	
	 			})
				.then(function(res) {
					res.body.notice.should.be.equal('Woot! Object updated successfully.')
					object = res.body.object
					object.roundone.hits.should.be.deep.equal([])
					// object.roundone.hits[1].should.be.not.equal([3])
				})
				.then(function(res) {
					done()
				})
			

			});


			it('should provide error message for data key for PULL operation', function(done) {
				
				var objUid = object.uid 
	 			
				R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
					"object": {
						"roundone": {
							"hits": {
								"PULL": "supertest"
							}
						}
					}
				}))
				.then(function(res) {
					res.body.should.be.deep.equal({
					  "error_message": "Bummer. Object update failed. Please enter valid data.",
					  "error_code": 121,
					  "errors": {
					    "roundone.hits": [
					      "has a invalid array operation."
					    ]
					  }
					})
				})
				.then(function(res) {
					done()
				})
			

			});


			it('should be able to PULL value(object property) from array while updating object', function(done) {
				
				R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, myclass7.uid, {
					"object": {
						"roundone": {
							"hits": ["401", "402", "403", "404", "405"],
							"name": "supertest3"
						}
					}
				}))
	 			.then(function(res) {
	 				console.log(res.body)
	 				objUid = res.body.object.uid
	 			})
				.then(function(res) {
					return R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
						"object": {
							"roundone": {
								"hits": {
									"PULL": {
										"data": 405
									}
								}
							}
						}
					}))
				})
				.then(function(res) {
					object = R.last(res.body.object.roundone.hits)
					object.should.not.equal(405)
				})
				.then(function(res) {
					done()
				})
			

			});

			
		});



		describe('UPDATE on group(array) field', function() {
			
			var myclass8, object1			

			before(function(done) {
				this.timeout(45000)
				R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
						"class": {
							"title": "myclass8",
							"uid": "complex",
							"inbuilt_class": false,
							"schema": [{
								"uid": "status",
								"data_type": "text",
								"display_name": "status",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": false,
								"format": "",
								"unique": null,
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								}
							}, {
								"uid": "group",
								"data_type": "group",
								"display_name": "group",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": true,
								"format": "",
								"unique": null,
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								},
								"schema": [{
									"uid": "name",
									"data_type": "text",
									"display_name": "name",
									"mandatory": false,
									"max": null,
									"min": null,
									"multiple": false,
									"format": "",
									"unique": null,
									"field_metadata": {
										"allow_rich_text": false,
										"multiline": false
									}
								}, {
									"uid": "marks",
									"data_type": "number",
									"display_name": "marks",
									"mandatory": false,
									"max": null,
									"min": null,
									"multiple": true,
									"format": "",
									"unique": null,
									"field_metadata": {
										"allow_rich_text": false,
										"multiline": false
									}
								}, {
									"uid": "subject",
									"data_type": "group",
									"display_name": "subject",
									"mandatory": false,
									"max": null,
									"min": null,
									"multiple": true,
									"format": "",
									"unique": null,
									"field_metadata": {
										"allow_rich_text": false,
										"multiline": false
									},
									"schema": [{
										"uid": "list",
										"data_type": "text",
										"display_name": "list",
										"mandatory": false,
										"max": null,
										"min": null,
										"multiple": true,
										"format": "",
										"unique": null,
										"field_metadata": {
											"allow_rich_text": false,
											"multiline": false
										}
									}]
								}]
							}]
						}
					}))
					.then(function(res) {
						myclass8 = res.body.class
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, myclass8.uid, {
							"object": {
								"status": "PASS",
								"group": [{
									"name": "userone",
									"marks": [52, 59, 57, 45],
									"subject": [{
										"list": ["PHY", "MATH", "SCI"]
									}, {
										"list": ["COM", "IT"]
									}]
								}, {
									"name": "userTwo",
									"marks": [69, 47, 66, 67],
									"subject": [{
										"list": ["PHY", "MATH", "SCI"]
									}, {
										"list": ["BIO", "ZOO", "MAR"]
									}]
								}]
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
			


			
			it.skip('should give error message for -ve index in UPDATE operation', function(done) {
				
	 			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, myclass7.uid, {
					"object": {
						"roundone": {
							"hits": ["201", "202", "203", "204", "205"],
							"name": "supertest2"
						}
					}
				}))
				.then(function(res) {
	 				objUid = res.body.object.uid
	 			})
				.then(function(res) {
					return R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
						"object": {
							"roundone": {
								"hits": {
									"PUSH": {
										"data": 9999,
										"index": -1
									}
								}
							}
						}
					}))
				})
				.then(function(res) {
					R.pretty(res.body)
					// res.body.should.be.deep.equal({
					//   "error_message": "Bummer. Object update failed. Please enter valid data.",
					//   "error_code": 121,
					//   "errors": {
					//     "Invalid parameters": [
					//       "have invalid update operation(s). Please check if they were performed on null values."
					//     ]
					//   }
					// })
				})
				.then(function(res) {
					done()
				})
			

			});			

			
			it.skip('should UPDATE the value(object property) at provided index', function(done) {
				
	 			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, myclass7.uid, {
					"object": {
						"roundone": {
							"hits": ["201", "202", "203", "204", "205"],
							"name": "supertest2"
						}
					}
				}))
				.then(function(res) {
	 				objUid = res.body.object.uid
	 			})
				.then(function(res) {
					return R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
						"object": {
							"roundone": {
								"hits": {
									"PUSH": {
										"data": 9999,
										"index": 1
									}
								}
							}
						}
					}))
				})
				.then(function(res) {
					R.pretty(res.body)
					// res.body.should.be.deep.equal({
					//   "error_message": "Bummer. Object update failed. Please enter valid data.",
					//   "error_code": 121,
					//   "errors": {
					//     "Invalid parameters": [
					//       "have invalid update operation(s). Please check if they were performed on null values."
					//     ]
					//   }
					// })
				})
				.then(function(res) {
					done()
				})
			

			});

			
			it('should UPDATE then value(dot property) at provided index', function(done) {
				
	 			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, myclass7.uid, {
					"object": {
						"roundone": {
							"hits": ["501", "502", "503", "504", "505"],
							"name": "supertest2"
						}
					}
				}))
				.then(function(res) {
	 				objUid = res.body.object.uid
	 			})
				.then(function(res) {
					return R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass7.uid, objUid, {
						"object": {
							"roundone.hits": {
								"UPDATE": {
									"data": "666",
									"index": 0
								}
							}
						}
					}))
				})
				.then(function(res) {
					res.body.notice.should.be.equal('Woot! Object updated successfully.')
					object = res.body.object
					object.roundone.hits[0].should.be.equal(666)
				})
				.then(function(res) {
					done()
				})
			

			});


			it.skip('should should provide error message for multiple values(object property) PUSH on same object', function(done) {
				
				var objUid = object1.uid

	 			R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass8.uid, objUid, {
						"object": {
							"group": {
								"UPDATE": {
									"index": 0,
									"data": {
										"marks": {
											"PUSH": {
												"data": [502, 503]
											}
										},
										"subject": {
											"list": {
												"PUSH": {
													"data": ["ENG"]
												}
											}
										}
									}
								}
							}
						}
					}))
				.then(function(res) {
					R.pretty(res.body)
					// res.body.notice.should.be.equal('Woot! Object updated successfully.')
					// object = res.body.object
					// object.roundone.hits[0].should.be.equal(666)
				})
				.then(function(res) {
					done()
				})
			

			});


			it('should should provide error message for multiple values(dot property) PUSH on same object', function(done) {
				
				var objUid = object1.uid

	 			R.Promisify(factories.create('update_object', appUser1.authtoken, app.api_key, myclass8.uid, objUid, {
					"object": {
						"group": {
							"UPDATE": {
								"index": 0,
								"data": {
									"marks": {
										"PUSH": {
											"data": [99, 98]
										}
									},
									"subject.0.list": {
										"PUSH": {
											"data": ["FRN"]
										},
										"subject.0.list": {
											"PULL": {
												"data": ["PHY"]
											}
										}
									}
								}
							}
						}
					}
				}))
				.then(function(res) {
					R.pretty(res.body)
					// res.body.notice.should.be.equal('Woot! Object updated successfully.')
					// object = res.body.object
					// object.roundone.hits[0].should.be.equal(666)
				})
				.then(function(res) {
					done()
				})
			

			});


		
		});

		
		describe('ADD_SUB', function() {
			
			before(function(done) {
				this.timeout(25000)
				
				R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
					"class": {
						"uid": "cash",
						"title": "cash",
						"schema": [{
							"uid": "cash_plus",
							"data_type": "number",
							"display_name": "cash_plus",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": true,
							"format": "",
							"unique": null,
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}, {
							"uid": "cash_minus",
							"data_type": "number",
							"display_name": "cash_minus",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}, {
							"uid": "group_cash",
							"data_type": "group",
							"display_name": "group_cash",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							},
							"schema": [{
								"uid": "add_cash",
								"data_type": "number",
								"display_name": "add_cash",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": true,
								"format": "",
								"unique": null,
								"action": "add",
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								}
							}, {
								"uid": "remove_cash",
								"data_type": "number",
								"display_name": "remove_cash",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": false,
								"format": "",
								"unique": null,
								"action": "add",
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								}
							}]
						}]
					}
				}))
				.then(function(res) {
					classMath = res.body.class
				})
				.then(function(res) {
					return R.Promisify(factories.create('Create_object', sys_user1.authtoken, app.api_key, classMath.uid, {
						"object": {
							"cash_plus": [4900, 6300],
							"cash_minus": 8500.7,
							"group_cash": {
								"add_cash": [52, 75],
								"remove_cash": 264.56
							}
						}
					}))
				})
				.then(function(res) {
					objectMath = res.body.object
				})
				.then(function(res) {
					done()
				})
				

			})


			it('should provide error message for array when index is not specifyed for field to ADD/SUB', function(done) {
				
				R.Promisify(factories.create('update_object', sys_user1.authtoken, app.api_key, classMath.uid, objectMath.uid, {
					"object": {
						"cash_plus": {
						    "ADD": 2000
						},
						"cash_minus": {
							"SUB": 500
						}
					}
				}))
				.then(function(res) {
					res.body.should.be.deep.equal({
					  "error_message": "Bummer. Object update failed. Please enter valid data.",
					  "error_code": 121,
					  "errors": {
					    "cash_plus": [
					      "is not multiple"
					    ]
					  }
					})
				})
				.then(function(res) {
					done()
				})
			
			});


			it('should able to ADD given number in present field in an array', function(done) {
				
				R.Promisify(factories.create('update_object', sys_user1.authtoken, app.api_key, classMath.uid, objectMath.uid, {
					"object": {
						"cash_plus.0": {
						    "ADD": 2000
						}
					}
				}))
				.then(function(res) {
					res.body.notice.should.be.equal('Woot! Object updated successfully.')
					object = res.body.object
					object.cash_plus[0].should.be.equal(6900)
					object.cash_plus[1].should.be.equal(6300)
				})
				.then(function(res) {
					done()
				})
			
			});


			it('should able to SUB given number in present field in an array', function(done) {
				
				R.Promisify(factories.create('update_object', sys_user1.authtoken, app.api_key, classMath.uid, objectMath.uid, {
					"object": {
						"cash_minus": {
							"SUB": 500.7
						}
					}
				}))
				.then(function(res) {
					res.body.notice.should.be.equal('Woot! Object updated successfully.')
					object = res.body.object
					object.cash_minus.should.be.equal(8000.000000000001)
				})
				.then(function(res) {
					done()
				})
			
			});


			it.skip('should provide error for null field ADD/sub operation', function(done) {
				
				R.Promisify(factories.create('update_object', sys_user1.authtoken, app.api_key, classMath.uid, objectMath.uid, {
					"object": {
						"cash_plus.4": {
						    "ADD": 2000
						}
					}
				}))
				.then(function(res) {
					return R.Promisify(factories.create('update_object', sys_user1.authtoken, app.api_key, classMath.uid, objectMath.uid, {
						"object": {
							"cash_plus.3": {
							    "ADD": 2000
							}
						}
					}))
				})
				.then(function(res) {
					R.pretty(res.body)
					// {
					//   "error_message": "Bummer. Object update failed. Please enter valid data.",
					//   "error_code": 121,
					//   "errors": {
					//     "5742cad56c0d05b67bbf1c8e')} has the field '3": [
					//       "has a invalid array operation."
					//     ]
					//   }
					// }
				})
				.then(function(res) {
					done()
				})
			
			});


			it('should able to ADD given number to number field present inside the group', function(done) {
				
				R.Promisify(factories.create('update_object', sys_user1.authtoken, app.api_key, classMath.uid, objectMath.uid, {
					"object": {
							"group_cash.add_cash.0": {"ADD": 50}
						}
					}
				))
				.then(function(res) {
					res.body.notice.should.be.equal('Woot! Object updated successfully.')
					object = res.body.object
					object.group_cash.add_cash[0].should.be.equal(102)
					object.group_cash.add_cash[1].should.be.equal(75)
					object.group_cash.remove_cash.should.be.equal(264.56)
				})
				.then(function(res) {
					done()
				})
			
			});


			it('should able to SUB given number to number field present inside the group', function(done) {
				
				R.Promisify(factories.create('update_object', sys_user1.authtoken, app.api_key, classMath.uid, objectMath.uid, {
						"object": {
							"group_cash.remove_cash": {
								"SUB": 200
							}
						}
					}))
				.then(function(res) {
					res.body.notice.should.be.equal('Woot! Object updated successfully.')
					object = res.body.object
					object.group_cash.remove_cash.should.be.equal(64.56)
				})
				.then(function(res) {
					done()
				})
			
			});


			it('should provide error message for incorrect group field', function(done) {
				
				R.Promisify(factories.create('update_object', sys_user1.authtoken, app.api_key, classMath.uid, objectMath.uid, {
					"object": {
						"group_cash.remove_cash.0": {
							"SUB": 264
						}
					}
				}))
				.then(function(res) {
					res.body.should.be.deep.equal({
					  "error_message": "Bummer. Object update failed. Please enter valid data.",
					  "error_code": 121,
					  "errors": {
					    "parameters": [
					      "has a invalid array operation."
					    ]
					  }
					})
				})
				.then(function(res) {
					done()
				})
			
			});


			it('should able to ADD given number to number field present inside the group', function(done) {
				
				R.Promisify(factories.create('update_object', sys_user1.authtoken, app.api_key, classMath.uid, objectMath.uid, {
					"object": {
							"group_cash.add_cash": {"ADD": 50}
						}
					}
				))
				.then(function(res) {
					res.body.should.be.deep.equal({
					  "error_message": "Bummer. Object update failed. Please enter valid data.",
					  "error_code": 121,
					  "errors": {
					    "group_cash.add_cash": [
					      "is not multiple"
					    ]
					  }
					})
				})
				.then(function(res) {
					done()
				})
			
			});



		});


		describe('UPSERT', function() {

			var classInfo

			before(function(done) {
				this.timeout(35000)
				R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
					"class": {
						"title": "myclass9",
						"uid": "myclass9",
						"inbuilt_class": false,
						"schema": [{
							"uid": "name",
							"data_type": "text",
							"display_name": "name",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}, {
							"uid": "age",
							"data_type": "number",
							"display_name": "age",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}, {
							"uid": "address",
							"data_type": "group",
							"display_name": "address",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							},
							"schema": [{
								"uid": "city",
								"data_type": "text",
								"display_name": "city",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": false,
								"format": "",
								"unique": null,
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								}
							}, {
								"uid": "state",
								"data_type": "text",
								"display_name": "state",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": false,
								"format": "",
								"unique": null,
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								}
							}]
						}]
					}
				}))
				.then(function(res) {
					classInfo = res.body.class
				})
				.then(function(res) {
					return factories.create('create_objects', 4, appUser1.authtoken, app.api_key, classInfo.uid, [{
						"name": "sam",
						"age": "20",
						"address": {
							"city": "mumbai",
							"state": "MH"
						}
					}, {
						"name": "sam",
						"age": "26",
						"address": {
							"city": "pune",
							"state": "MH"
						}
					}, {
						"name": "sham",
						"age": "32",
						"address": {
							"city": "dharmashala",
							"state": "HM"
						}
					}, {
						"name": "sing",
						"age": "24",
						"address": {
							"city": "sardar",
							"state": "PU"
						}
					}])
				})
				.then(function(res) {
					return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, classInfo.uid))
				})
				.then(function(res) {
					object1 = res.body.objects[0].uid
					object2 = res.body.objects[1].uid
					object3 = res.body.objects[2].uid
					object4 = res.body.objects[3].uid
				})
				.then(function(res) {
					return R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
						"class": {
							"title": "subject",
							"uid": "subject",
							"inbuilt_class": false,
							"schema": [{
								"uid": "sub_name",
								"data_type": "text",
								"display_name": "sub_name",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": false,
								"format": "",
								"unique": null,
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								},
								"reference_to": "myclass9"
							}, {
								"uid": "owner",
								"data_type": "reference",
								"display_name": "owner",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": false,
								"format": "",
								"unique": null,
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								},
								"reference_to": "myclass9"
							}]
						}
					}))
				})
				.then(function(res) {
					classRef = res.body.class
				})
				.then(function(res) {
					return factories.create('create_objects', 4, appUser1.authtoken, app.api_key, classRef.uid, [{
						"sub_name": "math",
						"owner": [object1]
					},
					{
						"sub_name": "ENG",
						"owner": [object2]
					},
					{
						"sub_name": "SCI",
						"owner": [object3]
					},
					{
						"sub_name": "COM",
						"owner": [object4]
					}])
				})
				.then(function(res) {
					return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, classRef.uid))
				})
				.then(function(res) {
					done()
				})
				.catch(function(err) {
        	console.log(err)
      	})
				

			})


			it('should search and update object using UPSERT operation', function(done) {
				
				R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classInfo.uid, {
				  "UPSERT": {
				    "address.city": "pune"
				  },
				  "object": {
				    "name": "sachin",
				    "age": 36,
				    "address": {
				      "state": "DL",
				      "city": "mumbai"
				    }
				  }
				}))
				.then(function(res) {
					res.body.notice.should.be.equal('Woot! Object updated successfully.')
				})
				.then(function(res) {
					return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, classInfo.uid))
				})
				.then(function(res) {
					object = res.body.objects[0]
					object.name.should.be.equal('sachin')
					object.address.state.should.be.equal('DL')
					object.address.city.should.be.equal('mumbai')
				})
				.then(function(res) {
					done()
				})
			
			});

			
			it('should search and create new object if not found', function(done) {
				// console.log(classInfo.uid)
				R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classInfo.uid, {
				  "UPSERT": {
				    "city": "ooty"
				  },
				  "object": {
				    "name": "hari",
				    "age": 28,
				    "address": {
				      "state": "kerala",
				      "city": "ooty"
				    }
				  }
				}))
				.then(function(res) {
					// R.pretty(res.body)
					res.body.notice.should.be.equal('Woot! Object created successfully.')
					object = res.body.object
					object.name.should.be.equal('hari')
					object.age.should.be.equal(28)
					object.address.state.should.be.equal('kerala')
					object.address.city.should.be.equal('ooty')
				})
				.then(function(res) {
					done()
				})
			
			});

			
			it('should able update reference object using UPSERT', function(done) {
				// console.log(classInfo.uid)
				R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classRef.uid, {
			    "object": {
		        "owner": [{
		          "UPSERT": {
		              "name": "sing"
		          },
		          "age": 55,
		          "address.state": "KT",
		          "address.city": "hampi"
		        }]
			    }
				}))
				.then(function(res) {
					res.body.notice.should.be.equal('Woot! Object created successfully.')
				})
				.then(function(res) {
					return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, classInfo.uid, {
					 "query": {
					    "name": "sing"
					  }
					}))
				})
				.then(function(res) {
					R.pretty(res.body)
				})
				.then(function(res) {
					done()
				})
			
			});

			
			it('should provide error message for duplicate field while UPSERT', function(done) {
				// console.log(classInfo.uid)
				R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classRef.uid, {
			    "object": {
		        "owner": [{
		          "UPSERT": {
		              "name": "sam"
		          },
		          "age": 55,
		          "address.state": "KT",
		          "address.city": "hampi"
		        }]
			    }
				}))
				.then(function(res) {
					res.body.should.be.deep.equal({
					  "error_message": "Bummer. Object creation failed. Please enter valid data.",
					  "error_code": 119,
					  "errors": {
					    "owner.0.UPSERT": [
					      "Bummer. Upsert failed. Multiple matching objects were found."
					    ]
					  }
					})
				})
				.then(function(res) {
					done()
				})
			
			});	


		


		});


	});






	describe('Uniqueness', function() {

		var user1, user2, user3, user4, user5, user6
		var appUser1, appUser2, appUser3, appUser4, appUser5, appUser6
		var tenant1, tenant2
		var classLocal, classGlobal, classUnique

		// create class and create mumtiple objects
		before(function(done) {
			this.timeout(60000)
			R.Promisify(factories.create('Create_tenants', sys_user1.authtoken, app.api_key, {
				"tenant": {
					"uid": "mumbai",
					"name": "mumbai",
					"description": "mumbai tenant is created by supertest"
				}
			}))
				.then(function(res) {
					tenant1 = res.body.tenant
				})
				.then(function(res) {
					return R.Promisify(factories.create('Create_tenants', sys_user1.authtoken, app.api_key, {
						"tenant": {
							"uid": "usa",
							"name": "usa",
							"description": "usa tenant is created by supertest"
						}
					}))
				})
				.then(function(res) {
					tenant2 = res.body.tenant
				})
				.then(function(res) {
					return factories.create('create_objects', 2, sys_user1.authtoken, app.api_key, 'built_io_application_user', [{
						"published": true,
						"active": true,
						"username": "userOne",
						"email": "userOne@mailinator.com",
						"password": "raw123",
						"password_confirmation": "raw123"
					}, {
						"published": true,
						"active": true,
						"username": "userTwo",
						"email": "userTwo@mailinator.com",
						"password": "raw123",
						"password_confirmation": "raw123"
					}], tenant1.uid)
				})
				.then(function(res) {
					return factories.create('create_objects', 2, sys_user1.authtoken, app.api_key, 'built_io_application_user', [{
						"published": true,
						"active": true,
						"username": "userThree",
						"email": "userThree@mailinator.com",
						"password": "raw123",
						"password_confirmation": "raw123"
					}, {
						"published": true,
						"active": true,
						"username": "userFour",
						"email": "userFour@mailinator.com",
						"password": "raw123",
						"password_confirmation": "raw123"
					}], tenant2.uid)
				})
				.then(function(res) {
					return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, 'built_io_application_user', '', '', tenant1.uid))
				})
				.then(function(res) {
					user1 = res.body.objects[0]
					user2 = res.body.objects[1]
				})
				.then(function(res) {
					return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, 'built_io_application_user', '', '', tenant2.uid))
				})
				.then(function(res) {
					user3 = res.body.objects[0]
					user4 = res.body.objects[1]
				})
				.then(function(res) {
					return R.Promisify(factories.create('login_app_user', app.api_key, {
						"application_user": {
							"email": user1.email,
							"password": "raw123"
						}
					}, tenant1.uid))
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
					}, tenant1.uid))
				})
				.then(function(res) {
					appUser2 = res.body.application_user
				})
				.then(function(res) {
					return R.Promisify(factories.create('login_app_user', app.api_key, {
						"application_user": {
							"email": user3.email,
							"password": "raw123"
						}
					}, tenant2.uid))
				})
				.then(function(res) {
					appUser3 = res.body.application_user
				})
				.then(function(res) {
					return R.Promisify(factories.create('login_app_user', app.api_key, {
						"application_user": {
							"email": user4.email,
							"password": "raw123"
						}
					}, tenant2.uid))
				})
				.then(function(res) {
					appUser4 = res.body.application_user
				})
				.then(function(res) {
					return factories.create('create_objects', 2, sys_user1.authtoken, app.api_key, 'built_io_application_user', [{
						"published": true,
						"active": true,
						"username": "userFive",
						"email": "userFive@mailinator.com",
						"password": "raw123",
						"password_confirmation": "raw123"
					}, {
						"published": true,
						"active": true,
						"username": "userSix",
						"email": "userSix@mailinator.com",
						"password": "raw123",
						"password_confirmation": "raw123"
					}])
				})
				.then(function(res) {
					return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, 'built_io_application_user', ''))
				})
				.then(function(res) {
					user5 = res.body.objects[0]
					user6 = res.body.objects[1]
				})
				.then(function(res) {
					return R.Promisify(factories.create('login_app_user', app.api_key, {
						"application_user": {
							"email": user5.email,
							"password": "raw123"
						}
					}))
				})
				.then(function(res) {
					appUser5 = res.body.application_user
				})
				.then(function(res) {
					return R.Promisify(factories.create('login_app_user', app.api_key, {
						"application_user": {
							"email": user6.email,
							"password": "raw123"
						}
					}))
				})
				.then(function(res) {
					appUser6 = res.body.application_user
				})
				.then(function(res) {
					done()
				})
				.catch(function(err) {
					console.log(err)
				})

		})



		describe('Localy unique', function() {

			// var classLocal

			before(function(done) {
				this.timeout(30000)
				R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
					"class": {
						"uid": "myclass",
						"title": "myclass",
						"schema": [{
							"uid": "uniquness",
							"data_type": "text",
							"display_name": "uniquness",
							"mandatory": false,
							"max": 6,
							"min": 2,
							"multiple": false,
							"format": "",
							"unique": "local",
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}]
					}
				}))
					.then(function(res) {
						classLocal = res.body.class
					})
					.then(function(res) {
						done()
					})
					.catch(function(err) {
						console.log(err)
					})

			})


			it('should have only localy unique objects per system user', function(done) {
				this.timeout(20000)

				R.Promisify(factories.create('Create_object', sys_user1.authtoken, app.api_key, classLocal.uid, {
					"object": {
						"uniquness": "test"
					}
				}))
					.then(function(res) {
						// console.log(res.body)
						return R.Promisify(factories.create('Create_object', sys_user2.authtoken, app.api_key, classLocal.uid, {
							"object": {
								"uniquness": "test"
							}
						}))
					})
					.then(function(res) {
						res.body.should.be.deep.equal({
							"error_message": "Bummer. Object creation failed. Please enter valid data.",
							"error_code": 119,
							"errors": {
								"uniquness": [
									"is not unique"
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


			it('should have only localy unique objects per application user(tenant)', function(done) {
				this.timeout(35000)
				R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classLocal.uid, {
					"object": {
						"uniquness": "test1"
					}
				}, tenant1.uid))
					.then(function(res) {
						res.body.notice.should.equal('Woot! Object created successfully.')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser2.authtoken, app.api_key, classLocal.uid, {
							"object": {
								"uniquness": "test1"
							}
						}, tenant1.uid))
					})
					.then(function(res) {
						res.body.notice.should.equal('Woot! Object created successfully.')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser2.authtoken, app.api_key, classLocal.uid, {
							"object": {
								"uniquness": "test1"
							}
						}, tenant1.uid))
					})
					.then(function(res) {
						res.body.should.be.deep.equal({
							"error_message": "Bummer. Object creation failed. Please enter valid data.",
							"error_code": 119,
							"errors": {
								"uniquness": [
									"is not unique"
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


			it('should have only localy unique objects as per application user and system user', function(done) {
				this.timeout(45000)
				R.Promisify(factories.create('Create_object', '', app.api_key, classLocal.uid, {
					"object": {
						"uniquness": "test1"
					}
				}))
					.then(function(res) {
						res.body.notice.should.equal('Woot! Object created successfully.')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', '', app.api_key, classLocal.uid, {
							"object": {
								"uniquness": "test1"
							}
						}))
					})
					.then(function(res) {
						res.body.should.be.deep.equal({
							"error_message": "Bummer. Object creation failed. Please enter valid data.",
							"error_code": 119,
							"errors": {
								"uniquness": [
									"is not unique"
								]
							}
						})
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser3.authtoken, app.api_key, classLocal.uid, {
							"object": {
								"uniquness": "test1"
							}
						}, tenant2.uid))
					})
					.then(function(res) {
						res.body.notice.should.equal('Woot! Object created successfully.')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', sys_user2.authtoken, app.api_key, classLocal.uid, {
							"object": {
								"uniquness": "test1"
							}
						}))
					})
					.then(function(res) {
						res.body.notice.should.equal('Woot! Object created successfully.')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', sys_user1.authtoken, app.api_key, classLocal.uid, {
							"object": {
								"uniquness": "test1"
							}
						}))
					})
					.then(function(res) {
						res.body.should.be.deep.equal({
							"error_message": "Bummer. Object creation failed. Please enter valid data.",
							"error_code": 119,
							"errors": {
								"uniquness": [
									"is not unique"
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


			it('should have only localy unique objects as per application user in tenant', function(done) {
				this.timeout(95000)
				R.Promisify(factories.create('Create_object', appUser5.authtoken, app.api_key, classLocal.uid, {
					"object": {
						"uniquness": "test1"
					}
				}))
					.then(function(res) {
						res.body.notice.should.equal('Woot! Object created successfully.')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser6.authtoken, app.api_key, classLocal.uid, {
							"object": {
								"uniquness": "test1"
							}
						}))
					})
					.then(function(res) {
						res.body.notice.should.equal('Woot! Object created successfully.')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser2.authtoken, app.api_key, classLocal.uid, {
							"object": {
								"uniquness": "test1"
							}
						}))
					})
					.then(function(res) {
						res.body.should.be.deep.equal({
							"error_message": "Bummer. Object creation failed. Please enter valid data.",
							"error_code": 119,
							"errors": {
								"uniquness": [
									"is not unique"
								]
							}
						})
					})
					.then(function(res) {
						done()
					})
					.catch(function(err) {
						console.log(err.trace)
					})


			});



		});


		describe('Global unique', function() {

			// var classGlobal

			before(function(done) {
				this.timeout(20000)
				R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
					"class": {
						"uid": "myclass1",
						"title": "myclass1",
						"schema": [{
							"uid": "name",
							"data_type": "text",
							"display_name": "name",
							"mandatory": false,
							"max": 7,
							"min": 2,
							"multiple": false,
							"format": "",
							"unique": "global",
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}]
					}
				}))
					.then(function(res) {
						classGlobal = res.body.class
					})
					.then(function(res) {
						done()
					})
					.catch(function(err) {
						console.log(err)
					})

			})


			it('should have only globaly unique objects per user', function(done) {
				this.timeout(35000)
				R.Promisify(factories.create('Create_object', sys_user1.authtoken, app.api_key, classGlobal.uid, {
					"object": {
						"name": "batman"
					}
				}))
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', '', app.api_key, classGlobal.uid, {
							"object": {
								"name": "batman"
							}
						}))
					})
					.then(function(res) {
						res.body.should.be.deep.equal({
							"error_message": "Bummer. Object creation failed. Please enter valid data.",
							"error_code": 119,
							"errors": {
								"name": [
									"is not unique"
								]
							}
						})
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classGlobal.uid, {
							"object": {
								"name": "batman"
							}
						}, tenant1.uid))
					})
					.then(function(res) {
						res.body.notice.should.equal('Woot! Object created successfully.')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser2.authtoken, app.api_key, classGlobal.uid, {
							"object": {
								"name": "batman"
							}
						}, tenant1.uid))
					})
					.then(function(res) {
						res.body.should.be.deep.equal({
							"error_message": "Bummer. Object creation failed. Please enter valid data.",
							"error_code": 119,
							"errors": {
								"name": [
									"is not unique"
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



		});


		describe('Change uniquness', function() {


			it('should not be able to uniquness change local to global on class', function(done) {

				R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
					"class": {
						"uid": "uniqueclass",
						"title": "uniqueclass",
						"schema": [{
							"uid": "name",
							"data_type": "text",
							"display_name": "name",
							"mandatory": false,
							"max": 7,
							"min": 2,
							"multiple": false,
							"format": "",
							"unique": "global",
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}]
					}
				}))
					.then(function(res) {
						classUnique = res.body.class
						classUnique.schema[0].unique.should.be.equal('global')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Update_class', sys_user1.authtoken, app.api_key, classUnique.uid, {
							"class": {
								"schema": [{
									"uid": "name",
									"data_type": "text",
									"display_name": "name",
									"mandatory": false,
									"max": 7,
									"min": 2,
									"multiple": false,
									"format": "",
									"unique": "local",
									"action": "add",
									"field_metadata": {
										"allow_rich_text": false,
										"multiline": false
									}
								}]
							}
						}))
					})
					.then(function(res) {
						res.body.notice.should.be.equal('Woot! Class updated successfully!')
						classUnique.schema[0].unique.should.be.equal('global')
					})
					.then(function(res) {
						done()
					})
					.catch(function(err) {
						console.log(err)
					})

			});


			it('should be able to change uniquness local to null on class', function(done) {

				R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
					"class": {
						"uid": "uniqueClass",
						"title": "uniqueClass",
						"schema": [{
							"uid": "name",
							"data_type": "text",
							"display_name": "name",
							"mandatory": false,
							"max": 7,
							"min": 2,
							"multiple": false,
							"format": "",
							"unique": "local",
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}]
					}
				}))
					.then(function(res) {
						// R.pretty(res.body)
						classUnique = res.body.class
						classUnique.schema[0].unique.should.be.equal('local')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Update_class', sys_user1.authtoken, app.api_key, classUnique.uid, {
							"class": {
								"schema": [{
									"uid": "name",
									"data_type": "text",
									"display_name": "name",
									"mandatory": false,
									"max": 7,
									"min": 2,
									"multiple": false,
									"format": "",
									"unique": null,
									"action": "add",
									"field_metadata": {
										"allow_rich_text": false,
										"multiline": false
									}
								}]
							}
						}))
					})
					.then(function(res) {
						res.body.notice.should.be.equal('Woot! Class updated successfully!')
						classUpdated = res.body.class
						should.not.exist(classUpdated.schema[0].unique)
					})
					.then(function(res) {
						done()
					})
					.catch(function(err) {
						console.log(err.trace)
					})

			});


			it('should be able to change uniquness global to null on class', function(done) {

				R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
					"class": {
						"uid": "uniqueClass2",
						"title": "uniqueClass2",
						"schema": [{
							"uid": "name",
							"data_type": "text",
							"display_name": "name",
							"mandatory": false,
							"max": 7,
							"min": 2,
							"multiple": false,
							"format": "",
							"unique": "global",
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}]
					}
				}))
					.then(function(res) {
						// R.pretty(res.body)
						classUnique = res.body.class
						classUnique.schema[0].unique.should.be.equal('global')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Update_class', sys_user1.authtoken, app.api_key, classUnique.uid, {
							"class": {
								"schema": [{
									"uid": "name",
									"data_type": "text",
									"display_name": "name",
									"mandatory": false,
									"max": 7,
									"min": 2,
									"multiple": false,
									"format": "",
									"unique": null,
									"action": "add",
									"field_metadata": {
										"allow_rich_text": false,
										"multiline": false
									}
								}]
							}
						}))
					})
					.then(function(res) {
						res.body.notice.should.be.equal('Woot! Class updated successfully!')
						classUpdated = res.body.class
						should.not.exist(classUpdated.schema[0].unique)
					})
					.then(function(res) {
						done()
					})
					.catch(function(err) {
						console.log(err.trace)
					})

			});


			it('should update class with other unique fields and create objects', function(done) {
				this.timeout(25000)
				// grp Golbal fields local
				R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
					"class": {
						"uid": "grpClass",
						"title": "grpClass",
						"schema": [{
							"uid": "name",
							"data_type": "text",
							"display_name": "name",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}, {
							"uid": "grp1",
							"data_type": "group",
							"display_name": "grp1",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": "global",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							},
							"schema": [{
								"uid": "id1",
								"data_type": "text",
								"display_name": "id1",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": false,
								"format": "",
								"unique": "local",
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								}
							}, {
								"uid": "num1",
								"data_type": "number",
								"display_name": "num1",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": true,
								"format": "",
								"unique": "local",
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								}
							}]
						}]
					}
				}))
					.then(function(res) {
						classUpdate = res.body.class
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser5.authtoken, app.api_key, classUpdate.uid, {
							"object": {
								"name": "test",
								"grp1": {
									"id1": "myid123",
									"num1": ["1", "2", "3"]
								}
							}
						}))
					})
					.then(function(res) {
						res.body.notice.should.be.equal('Woot! Object created successfully.')
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser6.authtoken, app.api_key, classUpdate.uid, {
							"object": {
								"name": "test",
								"grp1": {
									"id1": "myid123",
									"num1": ["3", "2", "1"]
								}
							}
						}))
					})
					.then(function(res) {
						return R.Promisify(factories.create('Update_class', sys_user1.authtoken, app.api_key, 'built_io_application_user', {
							"class": {
								"title": "grpClass",
								"uid": "grpclass",
								"inbuilt_class": false,
								"schema": [{
									"uid": "name",
									"data_type": "text",
									"display_name": "name",
									"mandatory": false,
									"max": null,
									"min": null,
									"multiple": false,
									"format": "",
									"unique": null,
									"field_metadata": {
										"allow_rich_text": false,
										"multiline": false
									}
								}, {
									"uid": "grp1",
									"data_type": "group",
									"display_name": "grp1",
									"mandatory": false,
									"max": null,
									"min": null,
									"multiple": false,
									"format": "",
									"unique": "global",
									"field_metadata": {
										"allow_rich_text": false,
										"multiline": false
									},
									"schema": [{
										"uid": "id1",
										"data_type": "text",
										"display_name": "id1",
										"mandatory": false,
										"max": null,
										"min": null,
										"multiple": false,
										"format": "",
										"unique": "local",
										"field_metadata": {
											"allow_rich_text": false,
											"multiline": false
										}
									}, {
										"uid": "num1",
										"data_type": "number",
										"display_name": "num1",
										"mandatory": false,
										"max": null,
										"min": null,
										"multiple": true,
										"format": "",
										"unique": "local",
										"field_metadata": {
											"allow_rich_text": false,
											"multiline": false
										}
									}]
								}, {
									"uid": "age",
									"data_type": "number",
									"display_name": "age",
									"mandatory": false,
									"max": null,
									"min": null,
									"multiple": false,
									"format": "",
									"unique": "global",
									"action": "add",
									"field_metadata": {
										"allow_rich_text": false,
										"multiline": false
									}
								}]
							}
						}))
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser6.authtoken, app.api_key, classUpdate.uid, {
							"object": {
								"name": "test",
								"grp1": {
									"id1": "myid456",
									"num1": ["4", "5", "6"]
								},
								"age": 10
							}
						}))
					})
					.then(function(res) {
						return R.Promisify(factories.create('Create_object', appUser5.authtoken, app.api_key, classUpdate.uid, {
							"object": {
								"name": "test",
								"grp1": {
									"id1": "myid456",
									"num1": ["4", "5", "6"]
								},
								"age": 10 //checking
							}
						}))
					})
					.then(function(res) {
						res.body.should.be.deep.equal({
							"error_message": "Bummer. Object creation failed. Please enter valid data.",
							"error_code": 119,
							"errors": {
								"grp1": [
									"is not unique"
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



		});


	});


	describe('System class group fields', function() {

		var userObj

		before(function(done) {
			R.Promisify(factories.create('Update_class', sys_user1.authtoken, app.api_key, 'built_io_application_user', {
				"class": {
					"schema": [{
						"uid": "group1",
						"data_type": "group",
						"display_name": "group1",
						"mandatory": true,
						"max": null,
						"min": null,
						"multiple": false,
						"format": "",
						"unique": null,
						"action": "add",
						"field_metadata": {
							"allow_rich_text": false,
							"multiline": false
						},
						"schema": [{
							"uid": "g1_field1",
							"data_type": "text",
							"display_name": "g1_field1",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}, {
							"uid": "g1_field2",
							"data_type": "number",
							"display_name": "g1_field2",
							"mandatory": true,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}, {
							"uid": "g1_group1",
							"data_type": "group",
							"display_name": "g1_group1",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							},
							"schema": [{
								"uid": "g1_g1_field1",
								"data_type": "text",
								"display_name": "g1_g1_field1",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": false,
								"format": "",
								"unique": null,
								"action": "add",
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": true
								}
							}, {
								"uid": "g1_g1_group1",
								"data_type": "group",
								"display_name": "g1_g1_group1",
								"mandatory": true,
								"max": null,
								"min": null,
								"multiple": false,
								"format": "",
								"unique": null,
								"action": "add",
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								},
								"schema": [{
									"uid": "g1_g1_g1_field1",
									"data_type": "mixed",
									"display_name": "g1_g1_g1_field1",
									"mandatory": true,
									"max": null,
									"min": null,
									"multiple": false,
									"format": "",
									"unique": "local",
									"action": "add",
									"field_metadata": {
										"allow_rich_text": false,
										"multiline": false
									}
								}]
							}]
						}, {
							"uid": "g1_group2",
							"data_type": "group",
							"display_name": "g1_group2",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": true,
							"format": "",
							"unique": null,
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							},
							"schema": [{
								"uid": "g1_g2_field1",
								"data_type": "number",
								"display_name": "g1_g2_field1",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": true,
								"format": "",
								"unique": null,
								"action": "add",
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								}
							}, {
								"uid": "g1_g2_group1",
								"data_type": "group",
								"display_name": "g1_g2_group1",
								"mandatory": false,
								"max": null,
								"min": null,
								"multiple": false,
								"format": "",
								"unique": null,
								"action": "add",
								"field_metadata": {
									"allow_rich_text": false,
									"multiline": false
								},
								"schema": [{
									"uid": "g1_g2_field1",
									"data_type": "text",
									"display_name": "g1_g2_field1",
									"mandatory": true,
									"max": 5,
									"min": 2,
									"multiple": true,
									"format": "",
									"unique": null,
									"action": "add",
									"field_metadata": {
										"allow_rich_text": true,
										"multiline": true
									}
								}]
							}]
						}]
					}]
				}
			}))
				.then(function(res) {
					return R.Promisify(factories.create('create_app_user_object', sys_user1.authtoken, app.api_key, {
						"object": {
							"published": true,
							"active": true,
							"group1": {
								"g1_field1": "group 1 field 1",
								"g1_field2": "100",
								"g1_group1": {
									"g1_g1_field1": "group 1 group 1 field1",
									"g1_g1_group1": {
										"g1_g1_g1_field1": "group 1 group 1 group 1 field1"
									}
								},
								"g1_group2": [{
									"g1_g2_field1": ["100", "100"],
									"g1_g2_group1": {
										"g1_g2_field1": ["abcde"]
									}
								}]
							},
							"username": "testuser",
							"email": "testuser@mailinator.com",
							"password": "raw123",
							"password_confirmation": "raw123",
							"device_type": "ios"
						}
					}))
				})
				.then(function(res) {
					userObj = res.body.object
				})
				.then(function(res) {
					done()
				})
				.catch(function(err) {
					console.log(err)
				})

		})


		it('should get application user object and check group fields', function(done) {
			R.Promisify(factories.create('get_app_user_objects', sys_user1.authtoken, app.api_key))
				.then(function(res) {
					object = res.body.objects[0]

					// R.pretty(res.body)

					// key assertion 
					Object.keys(object).should.to.be.deep.equal(['published', 'group1', 'username', 'email', 'device_type', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', 'ACL', '__loc', '_version', 'tags'])
					Object.keys(object.group1).should.to.be.deep.equal(['g1_field1', 'g1_field2', 'g1_group1', 'g1_group2'])
					Object.keys(object.group1.g1_group1).should.to.be.deep.equal(['g1_g1_field1', 'g1_g1_group1'])
					Object.keys(object.group1.g1_group1.g1_g1_group1).should.to.be.deep.equal(['g1_g1_g1_field1'])
					Object.keys(object.group1.g1_group2[0]).should.to.be.deep.equal(['g1_g2_field1', 'g1_g2_group1'])
					Object.keys(object.group1.g1_group2[0].g1_g2_group1).should.to.be.deep.equal(['g1_g2_field1'])

					// value assertion
					object.published.should.be.equal(true)
					object.group1.should.be.deep.equal({
						"g1_field1": "group 1 field 1",
						"g1_field2": 100,
						"g1_group1": {
							"g1_g1_field1": "group 1 group 1 field1",
							"g1_g1_group1": {
								"g1_g1_g1_field1": "group 1 group 1 group 1 field1"
							}
						},
						"g1_group2": [{
							"g1_g2_field1": [
								100,
								100
							],
							"g1_g2_group1": {
								"g1_g2_field1": [
									"abcde"
								]
							}
						}]
					})
					object.username.should.be.equal(userObj.username)
					object.email.should.be.equal(userObj.email)
					object.device_type.should.be.equal('ios')
					object.app_user_object_uid.should.be.equal('system')
					object.created_by.should.be.equal(object.updated_by)

					object.created_at.should.be.equal(object.updated_at)

					object.uid.should.be.equal(userObj.uid)
					object.active.should.be.equal(true)
					object.ACL.should.be.deep.equal({})
					object._version.should.be.equal(1)
					object.tags.should.be.deep.equal([])

					should.not.exist(object.__loc)

				})
				.then(function(res) {
					done()
				})

		});


		it('should update application user objects group fields ', function(done) {
			R.Promisify(factories.create('update_object_app_user', sys_user1.authtoken, app.api_key, userObj.uid, {
				"object": {
					"group1": {
						"g1_field1": "updated group 1 field 1",
						"g1_field2": "900",
						"g1_group1": {
							"g1_g1_field1": "updated group 1 group 1 field1",
							"g1_g1_group1": {
								"g1_g1_g1_field1": "updated group 1 group 1 group 1 field1"
							}
						},
						"g1_group2": [{
							"g1_g2_field1": ["900", "900", "900"],
							"g1_g2_group1": {
								"g1_g2_field1": ["zxcvb"]
							}
						}]
					}
				}
			}))
				.then(function(res) {
					object = res.body.object
					// R.pretty(res.body)

					// key assertion 
					Object.keys(object).should.to.be.deep.equal(['published', 'group1', 'username', 'email', 'device_type', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', 'ACL', '__loc', '_version', 'tags'])
					Object.keys(object.group1).should.to.be.deep.equal(['g1_field1', 'g1_field2', 'g1_group2', 'g1_group1'])
					Object.keys(object.group1.g1_group1).should.to.be.deep.equal(['g1_g1_field1', 'g1_g1_group1'])
					Object.keys(object.group1.g1_group1.g1_g1_group1).should.to.be.deep.equal(['g1_g1_g1_field1'])
					Object.keys(object.group1.g1_group2[0]).should.to.be.deep.equal(['g1_g2_field1', 'g1_g2_group1'])
					Object.keys(object.group1.g1_group2[0].g1_g2_group1).should.to.be.deep.equal(['g1_g2_field1'])

					// value assertion
					object.published.should.be.equal(true)
					object.group1.should.be.deep.equal({
						"g1_field1": "updated group 1 field 1",
						"g1_field2": 900,
						"g1_group1": {
							"g1_g1_field1": "updated group 1 group 1 field1",
							"g1_g1_group1": {
								"g1_g1_g1_field1": "updated group 1 group 1 group 1 field1"
							}
						},
						"g1_group2": [{
							"g1_g2_field1": [900, 900, 900],
							"g1_g2_group1": {
								"g1_g2_field1": ["zxcvb"]
							}
						}]
					})
					object.username.should.be.equal(userObj.username)
					object.email.should.be.equal(userObj.email)
					object.device_type.should.be.equal('ios')
					object.app_user_object_uid.should.be.equal('system')
					object.created_by.should.be.equal(object.updated_by)

					object.created_at.should.be.not.equal(object.updated_at)

					object.uid.should.be.equal(userObj.uid)
					object.active.should.be.equal(true)
					object.ACL.should.be.deep.equal({})
					object._version.should.be.equal(2)
					object.tags.should.be.deep.equal([])

					should.not.exist(object.__loc)

				})
				.then(function(res) {
					done()
				})

		});


	});



});