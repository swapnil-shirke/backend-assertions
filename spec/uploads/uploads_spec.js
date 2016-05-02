describe('Uploads --- ', function() {

	var api_key, appname, appUid, master_key
	var authtoken, userUID, username, email

	var uploadUID, uploadName
	var uploadUID1, uploadName1

	var uploadVideo
	var collaborator
	var app_user

	var uploadCollaborator, uploadAppuser


	before(function(done) {
		this.timeout(25000)

		R.Promisify(factories.create('login_system_user'))
			.then(function(res) {
				authtoken = res.body.user.authtoken;
				userUID   = res.body.user.uid;
				username  = res.body.user.username;
				email     = res.body.user.email;
			})
			.then(function(res) {
				return R.Promisify(factories.create('Create_application', authtoken))
			})
			.then(function(res) {
				api_key    = res.body.application.api_key;
				master_key = res.body.application.master_key;
				appname    = res.body.application.name;
				appUid     = res.body.application.uid
			})
			.then(function(res) {
				var filename = 'png_1.png'
				return R.Promisify(factories.create('create_upload', authtoken, api_key, filename))
			})
			.then(function(res) {
				uploadUID  = res.body.upload.uid
				uploadName = res.body.upload.filename
			})
			.then(function(res) {
				var filename = 'jpg_1.JPG'
				return R.Promisify(factories.create('create_upload', authtoken, api_key, filename))
			})
			.then(function(res) {
				uploadUID1  = res.body.upload.uid
				uploadName1 = res.body.upload.filename
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})

	})

	before(function(done) {
		this.timeout(15000)

		var email = 'jack.danials@mailinator.com'
		var password = 'raw123'

		R.Promisify(factories.create('create_app_user_object', authtoken, api_key, {
			"object": {
				"published": true,
				"active": true,
				"email": email,
				"password": password,
				"password_confirmation": password
			}
		}))
			.then(function(res) {
				return R.Promisify(factories.create('login_app_user', api_key, {
					"application_user": {
						"email": email,
						"password": password
					}
				}))
			})
			.then(function(res) {
				app_user = res.body.application_user
			})
			.then(function(res) {
				var filename = 'pdf_1.pdf'
				var PARAM = JSON.stringify({
					upload: {
						tags: ['supertest','backend']
					}
				})
				return R.Promisify(factories.create('create_upload', app_user.authtoken, api_key, filename, PARAM))
			})
			.then(function(res) {
				uploadAppuser = res.body.upload
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
				console.log(err)
			})

	})

	before(function(done) {
		this.timeout(20000)

		R.Promisify(factories.create('login_system_user', config.user3))
			.then(function(res) {
				collaborator = res.body.user
			})
			.then(function(res) {
				return R.Promisify(factories.create('invite_collaborator', authtoken, api_key, {
					"emails": [
						collaborator.email
					]
				}))
			})
			.then(function(res) {
				var filename = 'png_1.png'
				return R.Promisify(factories.create('create_upload', collaborator.authtoken, api_key, filename))
			})
			.then(function(res) {
				uploadCollaborator = res.body.upload
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



	describe('Get Uploads', function() {
		this.timeout(15000)
		before(function(done) {
			this.timeout(20000)
			var uploadGet1
			var filename1 = 'json_1.json'

			R.Promisify(factories.create('create_upload', authtoken, api_key, filename1))
				.then(function(res) {
					uploadGet1 = res.body.upload
				})
				.then(function(res) {
					done()
				})
				.catch(function(err) {
					console.log(err)
				})

		})

		it('should get all uploads created', function(done) {
			factories.create('get_uploads', authtoken, api_key)
				.end(function(err, res) {

					upload = res.body.uploads[0]
					uploadID = res.body.uploads[0].uid

					// key assertion 
					Object.keys(upload).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'content_type', 'file_size', 'tags', 'app_user_object_uid', 'filename', 'url', 'ACL'])

					// Data assertion
					upload.uid.should.be.a('string')
					upload.created_at.should.be.a('string')
					upload.updated_at.should.be.a('string')
					upload.created_by.should.be.a('string')
					upload.updated_by.should.be.a('string')
					upload.content_type.should.be.a('string')
					// upload.file_size.should.be.a('number')
					upload.tags.should.be.a('array')
					upload.app_user_object_uid.should.be.a('string')
					upload.url.should.be.a('string')
					upload.ACL.should.be.a('object')

					upload.uid.should.be.equal(uploadID)
					upload.created_at.should.be.equal(upload.updated_at)

					upload.created_by.should.be.equal(upload.updated_by)
					upload.created_by.should.be.equal(userUID)
					upload.updated_by.should.be.equal(userUID)
					upload.content_type.should.be.equal('application/json')


					upload.app_user_object_uid.should.be.equal('system')
					// upload.filename.should.be.equal(uploadName)


					done(err)
				})

		});

		it('should get single upload', function(done) {
			factories.create('get_single_upload', authtoken, api_key, uploadUID)

			.end(function(err, res) {

				upload = res.body.upload
				uploadID = res.body.upload.uid

				// key assertion 
				Object.keys(upload).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'content_type', 'file_size', 'tags', 'app_user_object_uid', 'filename', 'url', 'ACL'])

				// Data assertion
				upload.uid.should.be.a('string')
				upload.created_at.should.be.a('string')
				upload.updated_at.should.be.a('string')
				upload.created_by.should.be.a('string')
				upload.updated_by.should.be.a('string')
				upload.content_type.should.be.a('string')
				// upload.file_size.should.be.a('number')
				upload.tags.should.be.a('array')
				upload.app_user_object_uid.should.be.a('string')
				upload.url.should.be.a('string')
				upload.ACL.should.be.a('object')

				upload.uid.should.be.equal(uploadID)
				upload.created_at.should.be.equal(upload.updated_at)

				upload.created_by.should.be.equal(upload.updated_by)
				upload.created_by.should.be.equal(userUID)
				upload.updated_by.should.be.equal(userUID)
				upload.content_type.should.be.equal('image/png')


				upload.app_user_object_uid.should.be.equal('system')
				upload.filename.should.be.equal(uploadName)


				done(err)
			})

		});

	});


	describe('Get images and videos', function() {

		var filename2 = 'wmv_1.wmv'

		before(function(done) {
			this.timeout(7000)


			R.Promisify(factories.create('create_upload', authtoken, api_key, filename2))
				.then(function(res) {
					uploadVideo = res.body.upload
				})
				.then(function(res) {
					done()
				})
				.catch(function(err) {
					console.log(err)
				})

		})


		it('should get all images uploaded on backend', function(done) {
			factories.create('get_uploads_images', authtoken, api_key)
				.end(function(err, res) {
					
					upload = res.body.uploads[0]
					uploadID = res.body.uploads[0].uid

					// key assertion 
					Object.keys(upload).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'content_type', 'file_size', 'tags', 'app_user_object_uid', 'filename', 'url', 'ACL'])

					// Data assertion
					upload.uid.should.be.a('string')
					upload.created_at.should.be.a('string')
					upload.updated_at.should.be.a('string')
					upload.created_by.should.be.a('string')
					upload.updated_by.should.be.a('string')
					upload.content_type.should.be.a('string')
					// upload.file_size.should.be.a('number')
					upload.tags.should.be.a('array')
					upload.app_user_object_uid.should.be.a('string')
					upload.url.should.be.a('string')
					upload.ACL.should.be.a('object')

					upload.uid.should.be.equal(uploadID)
					upload.created_at.should.be.equal(upload.updated_at)

					upload.created_by.should.be.equal(upload.updated_by)
					upload.created_by.should.be.equal(collaborator.uid)
					upload.updated_by.should.be.equal(collaborator.uid)
					upload.content_type.should.be.equal('image/png')


					upload.app_user_object_uid.should.be.equal('system')
					// upload.filename.should.be.equal(uploadName)


					done(err)
				})

		});

		it('should get all videos uploaded on backend', function(done) {

			factories.create('get_uploads_videos', authtoken, api_key)
				.end(function(err, res) {
					
					upload = res.body.uploads[0]

					// key assertion 
					Object.keys(upload).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'content_type', 'file_size', 'tags', 'app_user_object_uid', 'filename', 'url', 'ACL'])

					// Data assertion
					upload.uid.should.be.a('string')
					upload.created_at.should.be.a('string')
					upload.updated_at.should.be.a('string')
					upload.created_by.should.be.a('string')
					upload.updated_by.should.be.a('string')
					upload.content_type.should.be.a('string')
					// upload.file_size.should.be.a('number')
					upload.tags.should.be.a('array')
					upload.app_user_object_uid.should.be.a('string')
					upload.url.should.be.a('string')
					upload.ACL.should.be.a('object')

					upload.uid.should.be.equal(uploadVideo.uid)
					upload.created_at.should.be.equal(upload.updated_at)

					upload.created_by.should.be.equal(upload.updated_by)
					upload.created_by.should.be.equal(userUID)
					upload.updated_by.should.be.equal(userUID)
					upload.content_type.should.be.equal('video/x-ms-wmv')


					upload.app_user_object_uid.should.be.equal('system')
					upload.filename.should.be.equal(filename2)


					done(err)
				})

		});

	});


	describe('create_upload', function() {

		it('should create an upload (system)', function(done) {

			var filename1 = 'jpg_1.JPG'

			factories.create('create_upload', authtoken, api_key, filename1)
				.end(function(err, res) {
					upload = res.body.upload


					res.body.notice.should.be.equal('Woot! File created successfully.')

					// key assertion 
					Object.keys(upload).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'content_type', 'file_size', 'tags', 'app_user_object_uid', 'filename', 'url', 'ACL'])

					// Data assertion
					upload.uid.should.be.a('string')
					upload.created_at.should.be.a('string')
					upload.updated_at.should.be.a('string')
					upload.created_by.should.be.a('string')
					upload.updated_by.should.be.a('string')
					upload.content_type.should.be.a('string')
					upload.file_size.should.be.a('string')
					upload.tags.should.be.a('array')
					upload.app_user_object_uid.should.be.a('string')
					upload.url.should.be.a('string')
					upload.ACL.should.be.a('object')

					upload.created_at.should.be.equal(upload.updated_at)
					upload.created_by.should.be.equal(upload.updated_by)
					upload.created_by.should.be.equal(userUID)
					upload.updated_by.should.be.equal(userUID)
					upload.content_type.should.be.equal('image/jpeg')
					upload.app_user_object_uid.should.be.equal('system')
					upload.filename.should.be.equal(filename1)
					upload.ACL.should.to.be.deep.equal({})


					done(err)
				})

		});

		it('should create an upload (collaborator)', function(done) {

			var filename1 = 'jpg_2.jpg'

			factories.create('create_upload', collaborator.authtoken, api_key, filename1)
				.end(function(err, res) {
					upload = res.body.upload

					res.body.notice.should.be.equal('Woot! File created successfully.')

					// key assertion 
					Object.keys(upload).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'content_type', 'file_size', 'tags', 'app_user_object_uid', 'filename', 'url', 'ACL'])

					// Data assertion
					upload.uid.should.be.a('string')
					upload.created_at.should.be.a('string')
					upload.updated_at.should.be.a('string')
					upload.created_by.should.be.a('string')
					upload.updated_by.should.be.a('string')
					upload.content_type.should.be.a('string')
					upload.file_size.should.be.a('string')
					upload.tags.should.be.a('array')
					upload.app_user_object_uid.should.be.a('string')
					upload.url.should.be.a('string')
					upload.ACL.should.be.a('object')

					upload.created_at.should.be.equal(upload.updated_at)
					upload.created_by.should.be.equal(upload.updated_by)
					upload.created_by.should.be.equal(collaborator.uid)
					upload.updated_by.should.be.equal(collaborator.uid)
					upload.content_type.should.be.equal('image/jpeg')
					upload.app_user_object_uid.should.be.equal('system')
					upload.filename.should.be.equal(filename1)
					upload.ACL.should.to.be.deep.equal({})


					done(err)
				})

		});

		it('should create an upload (anonymous)', function(done) {

			var filename1 = 'jpg_1.JPG'

			factories.create('create_upload', '', api_key, filename1)
				.end(function(err, res) {

					upload = res.body.upload

					res.body.notice.should.be.equal('Woot! File created successfully.')

					// key assertion 
					Object.keys(upload).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'content_type', 'file_size', 'tags', 'app_user_object_uid', 'filename', 'url', 'ACL'])

					// Data assertion
					upload.uid.should.be.a('string')
					upload.created_at.should.be.a('string')
					upload.updated_at.should.be.a('string')
					upload.content_type.should.be.a('string')
					upload.file_size.should.be.a('string')
					upload.tags.should.be.a('array')
					upload.url.should.be.a('string')
					upload.ACL.should.be.a('object')
					upload.ACL.can.should.be.a('array')

					// value assretion 
					upload.created_at.should.be.equal(upload.updated_at)
					should.not.exist(upload.created_by)
					should.not.exist(upload.updated_by)
					should.not.exist(upload.app_user_object_uid)
					upload.content_type.should.be.equal('image/jpeg')
					upload.filename.should.be.equal(filename1)
					upload.ACL.can.should.to.be.deep.equal(['update', 'delete'])



					done(err)
				})

		});

		it('should create an upload (application user)', function(done) {

			var filename = 'json_1.json'

			R.Promisify(factories.create('create_upload', app_user.authtoken, api_key, filename))
				.then(function(res) {

					var upload = res.body.upload

					// key assertion 
					Object.keys(upload).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'content_type', 'file_size', 'tags', 'app_user_object_uid', 'filename', 'url', 'ACL'])

					// Data assertion
					upload.uid.should.be.a('string')
					upload.created_at.should.be.a('string')
					upload.updated_at.should.be.a('string')
					upload.content_type.should.be.a('string')
					upload.file_size.should.be.a('string')
					upload.tags.should.be.a('array')
					upload.url.should.be.a('string')
					upload.app_user_object_uid.should.be.a('string')
					upload.ACL.should.be.a('object')
					upload.ACL.can.should.be.a('array')

					// value assretion 
					upload.created_at.should.be.equal(upload.updated_at)
					should.not.exist(upload.created_by)
					should.not.exist(upload.updated_by)
					upload.app_user_object_uid.should.be.equal(app_user.uid)
					upload.content_type.should.be.equal('application/json')
					upload.filename.should.be.equal(filename)
					upload.ACL.can.should.to.be.deep.equal(['update', 'delete'])
				})
				.then(function(res) {
					done()
				})

		});

	});


	describe('Uploads tags', function() {

		it('should get a list of all tags created', function(done) {
			factories.create('get_upload_tags', authtoken, api_key)
			.end(function(err, res){
				res.body.tags.should.to.be.deep.equal(['supertest', 'backend'])
				done(err)
			})
		});
		
	});


	describe('Update upload', function() {
		this.timeout(7000)
		it('should update given upload object as a collaborator', function(done) {

			var filename1 = 'csv_1.csv'

			factories.create('update_upload', collaborator.authtoken, api_key, uploadUID, filename1)
				.end(function(err, res) {

					res.body.notice.should.be.equal('Woot! File updated successfully.')
					var upload = res.body.upload

					Object.keys(upload).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'content_type', 'file_size', 'tags', 'app_user_object_uid', 'filename', 'url', 'ACL'])

					// Data assertion
					upload.uid.should.be.a('string')
					upload.created_at.should.be.a('string')
					upload.updated_at.should.be.a('string')
					upload.created_by.should.be.a('string')
					upload.updated_by.should.be.a('string')
					upload.content_type.should.be.a('string')
					// upload.file_size.should.be.a('number')
					upload.tags.should.be.a('array')
					upload.app_user_object_uid.should.be.a('string')
					upload.url.should.be.a('string')
					upload.ACL.should.be.a('object')

					upload.uid.should.be.equal(uploadUID)
					upload.created_at.should.be.not.equal(upload.updated_at)

					upload.created_by.should.be.not.equal(upload.updated_by)
					upload.created_by.should.be.equal(userUID)
					upload.updated_by.should.be.equal(collaborator.uid)
					upload.content_type.should.be.equal('text/csv')

					upload.app_user_object_uid.should.be.equal('system')
					upload.filename.should.be.equal(filename1)

					done(err)
				})

		});

		it('should provide error message when update object(system) as a application user', function(done) {

			var filename1 = 'csv_1.csv'

			factories.create('update_upload', app_user.authtoken, api_key, uploadUID1, filename1)
				.expect(401)
				.end(function(err, res) {

					res.body.error_message.should.be.equal('Access denied. You have insufficient permissions to perform this operation.')
					res.body.error_code.should.be.equal(162)

					done(err)
				})

		});

		it('should update upload object as a application user', function(done) {

			var filename1 = 'csv_1.csv'

			factories.create('update_upload', app_user.authtoken, api_key, uploadAppuser.uid, filename1)
				.expect(200)
				.end(function(err, res) {

					res.body.notice.should.be.equal('Woot! File updated successfully.')
					var upload = res.body.upload

					// key assertion 
					Object.keys(upload).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'content_type', 'file_size', 'tags', 'app_user_object_uid', 'filename', 'url', 'ACL'])

					// Data assertion
					upload.uid.should.be.a('string')
					upload.created_at.should.be.a('string')
					upload.updated_at.should.be.a('string')
					upload.content_type.should.be.a('string')
					upload.file_size.should.be.a('string')
					upload.tags.should.be.a('array')
					upload.url.should.be.a('string')
					upload.ACL.should.be.a('object')
					upload.ACL.can.should.be.a('array')

					// value assretion 
					upload.created_at.should.be.not.equal(upload.updated_at)
					should.not.exist(upload.created_by)
					should.not.exist(upload.updated_by)
					upload.app_user_object_uid.should.be.equal(app_user.uid)
					upload.content_type.should.be.equal('text/csv')
					upload.filename.should.be.equal(filename1)
					upload.ACL.can.should.to.be.deep.equal(['update', 'delete'])

					done(err)
				})

		});

	});


	describe('delete upload', function() {
		this.timeout(15000)
		it('should delete given upload object as a collaborator', function(done) {

			factories.create('delete_upload', collaborator.authtoken, api_key, uploadUID)
				.expect(200)
				.end(function(err, res) {
					res.body.notice.should.be.equal('Woot! File deleted successfully.')
					done(err)
				})

		});

		it('should provide error message when delete object(system) as a application user', function(done) {

			factories.create('delete_upload', app_user.authtoken, api_key, uploadUID1)
				.expect(401)
				.end(function(err, res) {

					res.body.error_message.should.be.equal('Access denied. You have insufficient permissions to perform this operation.')
					res.body.error_code.should.be.equal(162)

					done(err)
				})

		});

		it('should update upload object as a application user', function(done) {

			factories.create('delete_upload', app_user.authtoken, api_key, uploadAppuser.uid)
				.expect(200)
				.end(function(err, res) {
					res.body.notice.should.be.equal('Woot! File deleted successfully.')
					done(err)
				})

		});

	});


	describe('uploads default_acl', function() {

		it('should get the default ACL set for this application on uploads', function(done) {
			factories.create('get_default_acl', authtoken, api_key)
				.end(function(err, res) {
					
					var acl = res.body.DEFAULT_ACL

					// key assertion
					Object.keys(acl).should.to.be.deep.equal(['others'])
					Object.keys(acl.others).should.to.be.deep.equal(['read', 'create'])

					// data assertion
					acl.should.be.a('object')
					acl.others.read.should.be.a('boolean')
					acl.others.create.should.be.a('boolean')

					// value assertion 
					acl.others.read.should.be.equal(true)
					acl.others.create.should.be.equal(true)

					done(err)
				})

		});

		it('should Specify a default ACL for uploads', function(done) {
			factories.create('set_default_acl', authtoken, api_key, {
				"DEFAULT_ACL": {
					"others": {
						"create": false,
						"read": true,
						"update": false,
						"delete": false
					},
					"users": [{
						"uid": "anonymous",
						"create": false,
						"read": false,
						"update": false,
						"delete": false
					}],
					"roles": []
				}
			})
				.end(function(err, res) {
					
					res.body.notice.should.be.equal('Woot! Default ACL updated successfully.')
					var acl = res.body.DEFAULT_ACL

					// key assertion
					Object.keys(acl).should.to.be.deep.equal(['others', 'users'])
					Object.keys(acl.others).should.to.be.deep.equal(['create', 'read', 'update', 'delete'])
					Object.keys(acl.users[0]).should.to.be.deep.equal(['uid', 'create', 'read', 'update', 'delete'])

					// data assertion
					acl.should.be.a('object')
					acl.others.should.be.a('object')
					acl.users.should.be.a('array')

					// value assertion 
					acl.others.read.should.be.equal(true)
					acl.others.create.should.be.equal(false)
					acl.others.update.should.be.equal(false)
					acl.others.delete.should.be.equal(false)

					acl.users[0].uid.should.be.equal('anonymous')
					acl.users[0].read.should.be.equal(false)
					acl.users[0].create.should.be.equal(false)
					acl.users[0].update.should.be.equal(false)
					acl.users[0].delete.should.be.equal(false)

					done(err)
				})

		});

	});




})