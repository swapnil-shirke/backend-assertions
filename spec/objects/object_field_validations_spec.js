describe('Field validation ---', function() {
	
	var appUser1, appUser2
	var app, sysUser

	
	before(function(done) {
		
		R.Promisify(factories.create('login_system_user'))
			.then(function(res) {
				sysUser = res.body.user
			})
			.then(function(res) {
				return R.Promisify(factories.create('Create_application', sysUser.authtoken))
			})
			.then(function(res) {
				app = res.body.application
			})
			.then(function(res) {
				return factories.create('create_objects', 2, sysUser.authtoken, app.api_key, 'built_io_application_user', [{
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
				return R.Promisify(factories.create('get_all_objects', sysUser.authtoken, app.api_key, 'built_io_application_user', ''))
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
				appUser1 = res.body.application_user
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
				appUser1 = res.body.application_user
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})

	})


	after(function(done) {
		factories.create('Delete_application', sysUser.authtoken, app.api_key)
			.end(function(err, res1) {
				console.log("application delete")
				done(err)
			})
	
	})


	describe('Text', function() {
		
		var classtext
		
		before(function(done) {
			R.Promisify(factories.create('Create_class', sysUser.authtoken, app.api_key, {
				"class": {
					"uid": "classtext",
					"title": "classText",
					"schema": [{
						"uid": "textfield",
						"data_type": "text",
						"display_name": "textField",
						"mandatory": true,
						"max": 10,
						"min": 5,
						"multiple": false,
						// "format": "[abc]",
						"unique": null,
						"action": "add",
						"field_metadata": {
							"allow_rich_text": false,
							"multiline": false
						}
					}]
				}
			}))
			.then(function(res) {
				classText = res.body.class
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})
		

		})

		

		it('should provide an error message for min value for given text field', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classText.uid, {
				"object": {
					"textfield": "asd"	
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield": [
				      "is less than the minimum value 5"
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


		it('should provide an error message for max value for given text field', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classText.uid, {
				"object": {
					"textfield": "asdsfsdd5555"	
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield": [
				      "is greater than the maximum value 10"
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


		it('should provide an error message for mandatory value for given text field', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classText.uid, {
				"object": {
					"textfield": ""
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield": [
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


		it('should provide an error message for object value for given text field', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classText.uid, {
				"object": {
					"textfield": {"testing": "backend"}	
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield": [
				      "is not text"
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


		it('should provide an error message for array value for given text field', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classText.uid, {
				"object": {
					"textfield": ["testing", "backend"]	
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield": [
				      "should be a single value instead of multiple"
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


		it('should provide an error message for null value for given text field', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classText.uid, {
				"object": {
					"textfield": null	
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield": [
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


	});

	

	describe('Multiple and field format ', function() {
			
		var classTextMul
		
		before(function(done) {
			
			R.Promisify(factories.create('Create_class', sysUser.authtoken, app.api_key, {
				"class": {
					"title": "classTextMul",
					"uid": "classTextMul",
					"inbuilt_class": false,
					"schema": [{
						"uid": "textfield",
						"data_type": "text",
						"display_name": "textField",
						"mandatory": true,
						"max": null,
						"min": null,
						"multiple": true,
						"format": "[A-Q]",
						"unique": null,
						"field_metadata": {
							"allow_rich_text": false,
							"multiline": false
						}
					}]
				}
			}))
			.then(function(res) {
				classTextMul = res.body.class
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})
		

		})


		it('should provide an error message for blank array when field is mandatory', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classTextMul.uid, {
				"object": {
					"textfield": []
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield": [
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


		it('should provide an error message for multiple field when array is not provided', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classTextMul.uid, {
				"object": {
					"textfield": "asd"
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield": [
				      "is not multiple"
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


		it('should provide an error message for multiple field if blank', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classTextMul.uid, {
				"object": {
					"textfield": [""]
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield": [
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


		it.skip('should provide an error message for null inside an array', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classTextMul.uid, {
			    "object": {
			        "list": [null]
			    }
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "list": [
				      "is not present"
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


		it('should provide an error message for invalid value format for field', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classTextMul.uid, {
				"object": {
					"textfield": ["asdasd"]
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield.0": [
				      "does not match the required format for the field"
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


		it('should provide an error message for invalid value format in array field', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classTextMul.uid, {
				"object": {
					"textfield": ["ADS", "asdasd"]
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield.1": [
				      "does not match the required format for the field"
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


		it('should provide an error message for object value inside array field', function(done) {
			R.Promisify(factories.create('Create_object', appUser1.authtoken, app.api_key, classTextMul.uid, {
				"object": {
					"textfield": [{"ASD": "AD"}]
				}
			}))
			.then(function(res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "textfield.0": [
				      "is not text"
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