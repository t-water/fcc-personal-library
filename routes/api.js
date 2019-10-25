/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
const Books = require('../books');
var ObjectId = require('mongodb').ObjectId;
const MONGOOSE_CONNECTION_STRING = process.env.DB;
mongoose.connect(MONGOOSE_CONNECTION_STRING, {useNewUrlParser: true, useFindAndModify: false});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res, next){
      Books.find({})
      .then(books => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(books)
      },err => next(err))
      .catch(err => next(err))
    })
    
    .post(function (req, res, next){
      var title = req.body.title;
      Books.create(req.body)
      .then(book => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(book);
      },err => next(err))
      .catch(err => next(err));
    })
    
    .delete(function(req, res, next){
      Books.findById(req.body._id)
      .then(book => {
        if(book != null){
          Books.findByIdAndRemove(req.body._id)
          .then(book => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/text')
            res.send('Delete successful')
          }, err => next(err))
          .catch(err => next(err))
        }else{
          let err = new Error('Book not found') 
          err.status = 404;
          return next(err);
        }
      },err => next(err))
      .catch(err => next(err))
    });



  app.route('/api/books/:id')
    .get(function (req, res, next){
      var bookid = req.params.id;
      Books.findById(bookid)
      .then(book => {
        if(book != null){
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json(book);
        }else{
          let err = new Error('Book not found');
          err.status = 404;
          return next(err)
        }
      }, err => next(err))
      .catch(err => next(err))
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res, next){
      var bookid = req.params.id;
      var comment = req.body.comment;
      Books.findById(req.params.id)
      .then(book => {
        if(book != null){
          book.comments.push(comment);
          res.status = 200;
          res.setHeader('application/json')
          res.json(book)
        }else{
          let err = new Error('Book not found');
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err))
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
