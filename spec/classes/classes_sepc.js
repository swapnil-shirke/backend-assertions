describe('classes ---', function() {

	var authtoken, userUID
	var api_key
	var username
	var email
	var appname


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
				// console.log("application delete")
				done(err)
			})

	})



	describe('Get classes(inbuilt)', function() {


		it('should be able to get all classes present', function(done) {
			factories.create('Get_all_classes', authtoken, api_key, {
				"_method": "get"
			})
				.expect(200)
				.end(function(err, res) {
					// R.pretty(res.body)

					var app_user = res.body.classes[0]
					var app_user_role = res.body.classes[1]
					var installation_data = res.body.classes[2]
					var upload_class = res.body.classes[3]

					// Keys assertion
					Object.keys(app_user).should.to.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])
					Object.keys(app_user_role).should.to.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])
					Object.keys(installation_data).should.to.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])
					

					//console.log(app_user.schema[0])

					// Keys assertion schema
					Object.keys(app_user.schema[0]).should.to.be.deep.equal(['display_name', 'uid', 'data_type', 'unique', 'field_metadata', 'multiple', 'mandatory'])
					Object.keys(app_user_role.schema[0]).should.to.be.deep.equal(['display_name', 'uid', 'data_type', 'multiple', 'mandatory', 'unique', 'field_metadata'])
					Object.keys(installation_data.schema[0]).should.to.be.deep.equal(['display_name', 'uid', 'data_type', 'mandatory', 'field_metadata', 'multiple'])
					// Object.keys(upload_class.schema[0]).should.to.be.deep.equal(['display_name', 'uid', 'data_type', 'field_metadata', 'multiple', 'mandatory'])



					app_user.schema.length.should.be.equal(9)
					app_user_role.schema.length.should.be.equal(3)
					installation_data.schema.length.should.be.equal(7)
					// upload_class.schema.length.should.be.equal(3)

					// Data type assertion
					app_user.created_at.should.be.a('string')
					app_user.updated_at.should.be.a('string')
					app_user.title.should.be.a('string')
					app_user.uid.should.be.a('string')
					app_user.inbuilt_class.should.be.a('boolean')
					app_user.schema.should.be.a('array')
					app_user.maintain_revisions.should.be.a('boolean')
					app_user.abilities.should.be.a('object')
					app_user.DEFAULT_ACL.should.be.a('object')
					app_user.SYS_ACL.should.be.a('object')

					app_user_role.created_at.should.be.a('string')
					app_user_role.updated_at.should.be.a('string')
					app_user_role.title.should.be.a('string')
					app_user_role.uid.should.be.a('string')
					app_user_role.inbuilt_class.should.be.a('boolean')
					app_user_role.schema.should.be.a('array')
					app_user_role.maintain_revisions.should.be.a('boolean')
					app_user_role.abilities.should.be.a('object')
					app_user_role.DEFAULT_ACL.should.be.a('object')
					app_user_role.SYS_ACL.should.be.a('object')

					installation_data.created_at.should.be.a('string')
					installation_data.updated_at.should.be.a('string')
					installation_data.title.should.be.a('string')
					installation_data.uid.should.be.a('string')
					installation_data.inbuilt_class.should.be.a('boolean')
					installation_data.schema.should.be.a('array')
					installation_data.maintain_revisions.should.be.a('boolean')
					installation_data.abilities.should.be.a('object')
					installation_data.DEFAULT_ACL.should.be.a('object')
					installation_data.SYS_ACL.should.be.a('object')

					// upload_class.created_at.should.be.a('string')
					// upload_class.updated_at.should.be.a('string')
					// upload_class.title.should.be.a('string')
					// upload_class.uid.should.be.a('string')
					// upload_class.inbuilt_class.should.be.a('boolean')
					// upload_class.schema.should.be.a('array')
					// upload_class.maintain_revisions.should.be.a('boolean')
					// upload_class.abilities.should.be.a('object')
					// upload_class.DEFAULT_ACL.should.be.a('object')
					// upload_class.SYS_ACL.should.be.a('object')


					// Value assertion
					app_user.uid.should.be.equal('built_io_application_user')
					app_user.title.should.be.equal('Application User')
					app_user.inbuilt_class.should.be.equal(true)

					app_user_role.uid.should.be.equal('built_io_application_user_role')
					app_user_role.title.should.be.equal('Application User Role')
					app_user_role.inbuilt_class.should.be.equal(true)

					installation_data.uid.should.be.equal('built_io_installation_data')
					installation_data.title.should.be.equal('Installation Data')
					installation_data.inbuilt_class.should.be.equal(true)

					// upload_class.uid.should.be.equal('built_io_upload')
					// upload_class.title.should.be.equal('built.io Uploads')
					// upload_class.inbuilt_class.should.be.equal(true)

					done(err)
				})

		});

		it('should be able to get count for the classes present', function(done) {
			factories.create('Get_all_classes', authtoken, api_key, {
				"_method": "get",
				"count": true
			})
				.expect(200)
				.end(function(err, res) {
					//console.log(res.body)

					Object.keys(res.body).should.to.be.deep.equal(['classes'])
					res.body.classes.should.be.a('number')
					res.body.classes.should.be.equal(3)

					done(err)
				})

		});

		it('should be able to get classes using limit param', function(done) {
			factories.create('Get_all_classes', authtoken, api_key, {
				"_method": "get",
				"limit": 1
			})
				.expect(200)
				.end(function(err, res) {
					// console.log(res.body)
					var response = res.body.classes

					response.length.should.be.equal(1)

					// Keys assertion
					Object.keys(response[0]).should.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])
					// Data type assertion

					// Value assertion
					response[0].uid.should.be.equal('built_io_application_user')
					response[0].title.should.be.equal('Application User')
					response[0].inbuilt_class.should.be.equal(true)

					done(err)
				})

		});

		it('should be able to get classes using skip param', function(done) {
			factories.create('Get_all_classes', authtoken, api_key, {
				"_method": "get",
				"skip": 2
			})
				.expect(200)
				.end(function(err, res) {
					// console.log(res.body)
					var classes = res.body.classes

					classes.length.should.be.equal(1)

					// Keys assertion
					Object.keys(classes[0]).should.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])

					// Data type assertion

					// Value assertion
					classes[0].uid.should.be.equal('built_io_installation_data')
					classes[0].title.should.be.equal('Installation Data')
					classes[0].inbuilt_class.should.be.equal(true)

					done(err)
				})

		});

		it('should be able to get classes simple query', function(done) {
			factories.create('Get_all_classes', authtoken, api_key, {
				"_method": "get",
				"query": {
					"uid": "built_io_application_user_role"
				}
			})
				.expect(200)
				.end(function(err, res) {
					//console.log(res.body)
					var classes = res.body.classes

					classes.length.should.be.equal(1)

					// Keys assertion
					Object.keys(classes[0]).should.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])

					// Data type assertion

					// Value assertion
					classes[0].uid.should.be.equal('built_io_application_user_role')
					classes[0].title.should.be.equal('Application User Role')
					classes[0].inbuilt_class.should.be.equal(true)

					done(err)
				})

		});

		it('should provide error message for -ve skip/limit value', function(done) {

			factories.create('Get_all_classes', authtoken, api_key, {
				"_method": "get",
				"skip": -3
			})
			.expect(422) 
			.end(function(err, res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Failed to fetch classes. Please try again with valid parameters.",
				  "error_code": 141,
				  "errors": {
				    "params": [
				      "has an invalid operation."
				    ]
				  }
				})

				done(err)
			})

		});


	})


	describe('Class creation', function() {

		
		it('should be able to create a class for given app', function(done) {

			// var class_name = product_supertest;
			// var class_uid  = product_supertest;

			factories.create('Create_class', authtoken, api_key, {
				"class": {
					"title": "class_name",
					"uid": "class_uid",
					"schema": [{
						"multiple": false,
						"mandatory": true,
						"display_name": "Name",
						"uid": "name",
						"data_type": "text",
						"unique": "local"
					}]
				}
			})
				.expect(201)
				.end(function(err, res) {
					var res = res.body

					res.notice.should.be.equal('Woot! Class created successfully!')
					//console.log(res)

					// Keys assertion
					Object.keys(res.class).should.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])
					Object.keys(res.class.schema[0]).should.be.deep.equal(['multiple', 'mandatory', 'display_name', 'uid', 'data_type', 'unique'])
					Object.keys(res.class.abilities).should.be.deep.equal(['get_one_object', 'get_all_objects', 'create_object', 'update_object', 'delete_object', 'delete_all_objects'])
					Object.keys(res.class.DEFAULT_ACL).should.be.deep.equal(['others'])
					Object.keys(res.class.DEFAULT_ACL.others).should.be.deep.equal(['create', 'read'])

					// Data type assertion
					res.class.created_at.should.be.a('string')
					res.class.updated_at.should.be.a('string')
					res.class.title.should.be.a('string')
					res.class.uid.should.be.a('string')
					res.class.inbuilt_class.should.be.a('boolean')
					res.class.schema.should.be.a('array')
					res.class.last_activity.should.be.a('string')
					res.class.maintain_revisions.should.be.a('boolean')
					res.class.abilities.should.be.a('object')
					res.class.DEFAULT_ACL.should.be.a('object')
					res.class.SYS_ACL.should.be.a('object')

					res.class.schema.length.should.be.equal(1)

					// Value assertion
					res.class.title.should.be.equal('class_name')
					res.class.uid.should.be.equal('class_uid')
					res.class.inbuilt_class.should.be.equal(false)

					res.class.maintain_revisions.should.be.equal(false)
					res.class.abilities.get_one_object.should.be.equal(true)
					res.class.abilities.get_all_objects.should.be.equal(true)
					res.class.abilities.create_object.should.be.equal(true)
					res.class.abilities.update_object.should.be.equal(true)
					res.class.abilities.delete_object.should.be.equal(true)
					res.class.abilities.delete_all_objects.should.be.equal(true)


					res.class.DEFAULT_ACL.others.create.should.be.equal(true)
					res.class.DEFAULT_ACL.others.read.should.be.equal(true)


					// res.class.SYS_ACL.should.be.equal({})

					// res.class.DEFAULT_ACL.length.should.be.equal('others')

					done(err)
				})

		});


		it('should provide an error message for invalid json param', function(done) {

			// var class_name = product_supertest;
			// var class_uid  = product_supertest;

			factories.create('Create_class', authtoken, api_key, {
				"classes": {
					"title": "class_name",
					"uid": "class_uid",
					"schema": [{
						"multiple": false,
						"mandatory": true,
						"display_name": "Name",
						"uid": "name",
						"data_type": "text",
						"unique": "local"
					}]
				}
			})
			// .expect(201)
			.end(function(err, res) {
				res.body.should.be.deep.equal({
					"error_message": "Please send your attributes wrapped in 'class'",
					"error_code": 141,
					"errors": {}
				})

				done(err)
			})

		});


		it('should provide an error message for invalid schema', function(done) {

			// var class_name = product_supertest;
			// var class_uid  = product_supertest;

			factories.create('Create_class', authtoken, api_key, {
				"class": {
					"title": "class_name",
					"uid": "class_uid"
				}
			})
			// .expect(201)
			.end(function(err, res) {
				// R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Class creation failed. Please try again.",
				  "error_code": 115,
				  "errors": {
				    "schema": [
				      "should have a group schema"
				    ]
				  }
				})

				done(err)
			})

		});


		it('should provide an error message for invalid authtoken', function(done) {

			// var class_name = product_supertest;
			// var class_uid  = product_supertest;

			factories.create('Create_class', '', api_key, {
				"classes": {
					"title": "class_name",
					"uid": "class_uid",
					"schema": [{
						"multiple": false,
						"mandatory": true,
						"display_name": "Name",
						"uid": "name",
						"data_type": "text",
						"unique": "local"
					}]
				}
			})
			// .expect(201)
			.end(function(err, res) {

				res.body.should.be.deep.equal({
					"error_message": "Hey! You're not allowed in here unless you're logged in.",
					"error_code": 105,
					"errors": {}
				})

				done(err)
			})

		});

	
	})


	describe('Get class', function() {


		it('should be able to get single(built_io_installation_data) class', function(done) {

			var classUid = "built_io_installation_data"

			factories.create('Get_a_class', authtoken, api_key, classUid)
				.expect(200)
				.end(function(err, res) {

					var installation = res.body.class

					// Keys assertion
					Object.keys(installation).should.to.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])
					Object.keys(installation.schema[0]).should.to.be.deep.equal(['display_name', 'uid', 'data_type', 'mandatory', 'field_metadata', 'multiple'])

					installation.schema.length.should.be.equal(7)

					// Data type assertion
					installation.created_at.should.be.a('string')
					installation.updated_at.should.be.a('string')
					installation.title.should.be.a('string')
					installation.uid.should.be.a('string')
					installation.inbuilt_class.should.be.a('boolean')
					installation.schema.should.be.a('array')
					installation.maintain_revisions.should.be.a('boolean')
					installation.abilities.should.be.a('object')
					installation.DEFAULT_ACL.should.be.a('object')
					installation.SYS_ACL.should.be.a('object')

					// Value assertion
					installation.uid.should.be.equal('built_io_installation_data')
					installation.title.should.be.equal('Installation Data')
					installation.inbuilt_class.should.be.equal(true)

					done(err)
				})

		});

		it('should be able to get single(built_io_application_user_role) class', function(done) {

			var classUid = "built_io_application_user_role"

			factories.create('Get_a_class', authtoken, api_key, classUid)
				.expect(200)
				.end(function(err, res) {

					var appUserRole = res.body.class
						//console.log(appUserRole)

					// Keys assertion
					Object.keys(appUserRole).should.to.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])
					Object.keys(appUserRole.schema[0]).should.to.be.deep.equal(['display_name', 'uid', 'data_type', 'multiple', 'mandatory', 'unique', 'field_metadata'])

					appUserRole.schema.length.should.be.equal(3)

					// Data type assertion
					appUserRole.created_at.should.be.a('string')
					appUserRole.updated_at.should.be.a('string')
					appUserRole.title.should.be.a('string')
					appUserRole.uid.should.be.a('string')
					appUserRole.inbuilt_class.should.be.a('boolean')
					appUserRole.schema.should.be.a('array')
					appUserRole.maintain_revisions.should.be.a('boolean')
					appUserRole.abilities.should.be.a('object')
					appUserRole.DEFAULT_ACL.should.be.a('object')
					appUserRole.SYS_ACL.should.be.a('object')


					// Value assertion
					appUserRole.uid.should.be.equal('built_io_application_user_role')
					appUserRole.title.should.be.equal('Application User Role')
					appUserRole.inbuilt_class.should.be.equal(true)

					done(err)
				})

		});

		it('should be able to get single(built_io_application_user) class', function(done) {

			var classUid = "built_io_application_user"

			factories.create('Get_a_class', authtoken, api_key, classUid)
				.expect(200)
				.end(function(err, res) {

					var appUserClass = res.body.class

					// Keys assertion
					Object.keys(appUserClass).should.to.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])
					Object.keys(appUserClass.schema[0]).should.to.be.deep.equal(['display_name', 'uid', 'data_type', 'unique', 'field_metadata', 'multiple', 'mandatory'])

					appUserClass.schema.length.should.be.equal(9)

					// Data type assertion
					appUserClass.created_at.should.be.a('string')
					appUserClass.updated_at.should.be.a('string')
					appUserClass.title.should.be.a('string')
					appUserClass.uid.should.be.a('string')
					appUserClass.inbuilt_class.should.be.a('boolean')
					appUserClass.schema.should.be.a('array')
					appUserClass.maintain_revisions.should.be.a('boolean')
					appUserClass.abilities.should.be.a('object')
					appUserClass.DEFAULT_ACL.should.be.a('object')
					appUserClass.SYS_ACL.should.be.a('object')

					// Value assertion
					appUserClass.uid.should.be.equal('built_io_application_user')
					appUserClass.title.should.be.equal('Application User')
					appUserClass.inbuilt_class.should.be.equal(true)

					done(err)
				})

		});

		it('should be able to get single(inbuilt) class', function(done) {

			var classUid = "built_io_application_user"

			factories.create('Get_a_class', authtoken, api_key, classUid)
				.expect(200)
				.end(function(err, res) {
					// R.pretty(res.body)
					var uploadClass = res.body.class

					// Keys assertion
					Object.keys(uploadClass).should.to.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])
					Object.keys(uploadClass.schema[0]).should.to.be.deep.equal(['display_name', 'uid', 'data_type', 'unique', 'field_metadata', 'multiple', 'mandatory'])
					// console.log(uploadClass.schema.length)
					uploadClass.schema.length.should.be.equal(9)

					// Data type assertion
					uploadClass.created_at.should.be.a('string')
					uploadClass.updated_at.should.be.a('string')
					uploadClass.title.should.be.a('string')
					uploadClass.uid.should.be.a('string')
					uploadClass.inbuilt_class.should.be.a('boolean')
					uploadClass.schema.should.be.a('array')
					uploadClass.maintain_revisions.should.be.a('boolean')
					uploadClass.abilities.should.be.a('object')
					uploadClass.DEFAULT_ACL.should.be.a('object')
					uploadClass.SYS_ACL.should.be.a('object')

					// Value assertion
					uploadClass.uid.should.be.equal('built_io_application_user')
					uploadClass.title.should.be.equal('Application User')
					uploadClass.inbuilt_class.should.be.equal(true)

					done(err)
				})

		});


	})


	describe('Update class', function() {

		it('should be able to update the given class', function(done) {

			factories.create('Create_class', authtoken, api_key, {
				"class": {
					"title": "testclas",
					"uid": "testclass",
					"schema": [{
						"multiple": false,
						"mandatory": true,
						"display_name": "Name",
						"uid": "name",
						"data_type": "text",
						"unique": "local"
					}]
				}
			})
				.expect(201)
				.end(function(err, res1) {

					var classUid = res1.body.class.uid

					factories.create('Update_class', authtoken, api_key, classUid, {
						"class": {
							"title": "changed",
							"schema": [{
									"multiple": false,
									"mandatory": true,
									"display_name": "name",
									"uid": "name",
									"data_type": "text",
									"unique": "local"
								}, {
									"multiple": false,
									"mandatory": true,
									"display_name": "count",
									"uid": "count",
									"data_type": "number",
									"unique": "local"
								}

							]
						}
					})
						.expect(200)
						.end(function(err, res2) {
							// R.pretty(res2.body)
							var updatedClss = res2.body.class

							Object.keys(updatedClss).should.be.deep.equal(['created_at', 'updated_at', 'title', 'uid', 'inbuilt_class', 'schema', 'last_activity', 'maintain_revisions', 'abilities', 'DEFAULT_ACL', 'SYS_ACL'])
							Object.keys(updatedClss.schema[0]).should.be.deep.equal(['multiple', 'mandatory', 'display_name', 'uid', 'data_type', 'unique'])
							Object.keys(updatedClss.abilities).should.be.deep.equal(['get_one_object', 'get_all_objects', 'create_object', 'update_object', 'delete_object', 'delete_all_objects'])
							Object.keys(updatedClss.DEFAULT_ACL).should.be.deep.equal(['others'])
							Object.keys(updatedClss.DEFAULT_ACL.others).should.be.deep.equal(['create', 'read'])

							// Data type assertion
							updatedClss.created_at.should.be.a('string')
							updatedClss.updated_at.should.be.a('string')
							updatedClss.title.should.be.a('string')
							updatedClss.uid.should.be.a('string')
							updatedClss.inbuilt_class.should.be.a('boolean')
							updatedClss.schema.should.be.a('array')
							updatedClss.last_activity.should.be.a('string')
							updatedClss.maintain_revisions.should.be.a('boolean')
							updatedClss.abilities.should.be.a('object')
							updatedClss.DEFAULT_ACL.should.be.a('object')
							updatedClss.SYS_ACL.should.be.a('object')

							updatedClss.schema.length.should.be.equal(2)

							// Value assertion
							updatedClss.title.should.be.equal('changed')
							updatedClss.uid.should.be.equal('testclass')
							updatedClss.inbuilt_class.should.be.equal(false)

							updatedClss.maintain_revisions.should.be.equal(false)
							updatedClss.abilities.get_one_object.should.be.equal(true)
							updatedClss.abilities.get_all_objects.should.be.equal(true)
							updatedClss.abilities.create_object.should.be.equal(true)
							updatedClss.abilities.update_object.should.be.equal(true)
							updatedClss.abilities.delete_object.should.be.equal(true)
							updatedClss.abilities.delete_all_objects.should.be.equal(true)


							updatedClss.DEFAULT_ACL.others.create.should.be.equal(true)
							updatedClss.DEFAULT_ACL.others.read.should.be.equal(true)



							done(err)
						})
				})

		});

	})


	describe('Delete Class', function(done) {

		it('should be able to delete class', function(done) {
			factories.create('Create_class', authtoken, api_key, {
				"class": {
					"title": "new class",
					"uid": "new_class",
					"schema": [{
						"multiple": false,
						"mandatory": true,
						"display_name": "Name",
						"uid": "name",
						"data_type": "text",
						"unique": "local"
					}]
				}
			})
				.expect(200)
				.end(function(err, res1) {


					var classUid = res1.body.class.uid

					factories.create('Delete_class', authtoken, api_key, classUid)
						.expect(200)
						.end(function(err, res2) {

							res2.body.notice.should.be.equal('Woot! Class deleted successfully!')

							done(err)
						})


				})

		});

		
		it('should provide an error messgae on application user class delete', function(done) {
			
			var classUid = "built_io_application_user"

			R.Promisify(factories.create('Delete_class', authtoken, api_key, classUid))
			.then(function(res) {
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Class delete failed. Please try again.",
				  "error_code": 117,
				  "errors": {
				    "inbuilt_class": [
				      "cannot be removed"
				    ]
				  }
				})
			})
			.then(function(res) {
				done()
			})
		
		});

		
		it('should provide an error messgae on application user role class delete', function(done) {
			
			var classUid = "built_io_application_user_role"

			R.Promisify(factories.create('Delete_class', authtoken, api_key, classUid))
			.then(function(res) {
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Class delete failed. Please try again.",
				  "error_code": 117,
				  "errors": {
				    "inbuilt_class": [
				      "cannot be removed"
				    ]
				  }
				})
			})
			.then(function(res) {
				done()
			})
		
		});

		
		it.skip('should provide an error messgae on upload class delete', function(done) {
			
			var classUid = "built_io_upload"

			R.Promisify(factories.create('Delete_class', authtoken, api_key, classUid))
			.then(function(res) {
				R.pretty(res.body)
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Class delete failed. Please try again.",
				  "error_code": 117,
				  "errors": {
				    "inbuilt_class": [
				      "cannot be removed"
				    ]
				  }
				})
			})
			.then(function(res) {
				done()
			})
		
		});


		it('should provide an error messgae on upload class delete', function(done) {
			
			var classUid = "built_io_installation_data"

			R.Promisify(factories.create('Delete_class', authtoken, api_key, classUid))
			.then(function(res) {
				res.body.should.be.deep.equal({
				  "error_message": "Bummer. Class delete failed. Please try again.",
				  "error_code": 117,
				  "errors": {
				    "inbuilt_class": [
				      "cannot be removed"
				    ]
				  }
				})
			})
			.then(function(res) {
				done()
			})
		
		});



	})



})