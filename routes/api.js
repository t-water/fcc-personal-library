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
        let results = []
        books.forEach(book => results.push({"title": book.title, "_id": book._id, "commentcount": book.comments.length}))
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(results)
      },err => next(err))
      .catch(err => next(err))
    })
    
    .post(function (req, res, next){
      var title = req.body.title;
      Books.create(req.body)
      .then(book => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({title: book.title, "_id": book._id});
      },err => next(err))
      .catch(err => next(err));
    })
    
    .delete(function(req, res, next){

    });



  app.route('/api/books/:id')
    .get(function (req, res, next){
      var bookid = req.params.id;
      Books.findById(bookid)
      .then(book => {
        if(book != null){
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({"title": book.title, "_id": book._id, "comments": book.comments});
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
          book.save()
          .then(book => {
            res.status = 200;
            res.setHeader('Content-type', 'application/json')
            res.json({"book_id": book._id, "comment": book.comments[book.comments.length -1]})
          }, err => next(err))
          .catch(err => next(err))
        }else{
          let err = new Error('Book not found');
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err))
    })
    
    .delete(function(req, res, next){
      var bookid = req.params.id;
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
  
};
