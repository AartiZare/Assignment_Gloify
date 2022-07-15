const bookModel = require("../models/bookModel")
const ObjectId = require("mongoose").Types.ObjectId;


const isValid = function (value) {
    if (typeof (value) === undefined || typeof (value) === null) { return false }
    if (typeof (value) === "string" && (value).trim().length > 0) { return true }
}


//--------------------------------------------Adding the new Book---------------------------------------------------------------//

const addBook = async function(req, res){
    try{

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "Enter valid data" });
          }

            let data = req.body;
            let {title, author, storeId, ISBN, category} = data


            if(!ObjectId.isValid(storeId)){
                return res.status(400).send({status: false, msg: "Please enter valid storeId"})
            }

            if(!isValid(title)){
                return res.status(400).send({status: false, msg: "Enter valid title"})
            }
            if(!isValid(author)){
                return res.status(400).send({status: false, msg: "Please enter author Name"})
            }

            if (!isValid(ISBN)) { 
                return res.status(400).send({ status: false, message: "ISBN is required" })
             }
             //Checking if ISBN is a 13 digit valid number or not
            let isbn = data.ISBN
            let validateISBN = function (isbn) {
                return /^(\d{13})?$/.test(isbn)
            }
            if (!validateISBN(isbn)){
            return res.status(400).send({status: false , message: "Please enter a 13 digit valid ISBN"})
            }
            ////Checking if ISBN already exists (i.e. ISBN is not unique)
            let uniqueISBN = await bookModel.findOne({ISBN : data.ISBN})
            if (uniqueISBN) {
                return res.status(400).send({status: false , message: "ISBN already exists"})
            }
            if (!isValid(category)) { 
                return res.status(400).send({ status: false, message: "category is required" })
            }

            const createNewBook = await bookModel.create(data)
            return res.status(201).send({ status: true, msg: "Created succesfully", data: createNewBook });
    
    }
    catch(error){
        return res.status(500).send({status: false, msg: error.message})
    }
}


//-----------------------------------------------Fetching book List------------------------------------------------------//

const getBooks = async function(req,res){
    try{
          const filterBooks = {isDeleted: false}
          const queryParams = req.query
  
          if(Object.keys(queryParams) != 0){
            let {bookId, author, title, category} = queryParams
  
            if(isValid(bookId)){
              filterBooks['bookId'] = bookId
            }
            if(isValid(author)){
                filterBooks['author'] = author
            }
            if(isValid(title)){
                filterBooks['title'] = title
            }
            if(isValid(category)){
                filterBooks['category'] = category
            }
  
          const books = await bookModel.find({$and: [filterBooks]})
          if(Array.isArray(books) && books.length==0){
            return res.status(404).send({status: false, msg: "No Books found"})
          }
          return res.status(200).send({status: true, msg: "Books List", data: books});
        }
          else{
            const books = await bookModel.find({filterBooks})
            if(Array.isArray(books) && books.length == 0){
              return res.status(404).send({status: false, msg:"No Books are there"})
            }
            return res.status(200).send({status: true, msg: "successfully fetched book lists", data: books})
          }
    }
    catch(error){
        return res.status(500).send({status:false,msg:error.message})
    }
  
  }
   


//--------------------------------------------Updating Book--------------------------------------------------------------//

            const updateBook = async function (req , res)  {
                try {
                    let book_Id = req.params.bookId
                    //Validate: The bookId is valid or not.
                    let Book = await bookModel.findById(book_Id)
                    if (!Book) return res.status(404).send({ status: false, message: "Book does not exists" })
            
                    //Validate: If the bookId exists (must have isDeleted false)
                    let is_Deleted = Book.isDeleted
                    if (is_Deleted == true) return res.status(404).send({ status: false, message: "Book does not exists" })
                    
                    //Checking if no data is present in request body
                    let data = req.body
                    if (Object.keys(data) == 0) {
                    return res.status(400).send({ status: false, message: "Please provide some data to update a book document" })
                    }
            
                    //Updates a book by changing these values 
                    let Title = req.body.title
                    let isbn = req.body.ISBN
                    let Price = req.body.price
                    
                    //Checking if title is unique or not
                    let uniqueTitle = await bookModel.findOne({title : Title})
                    if (uniqueTitle) {
                      return res.status(400).send({status: false , message: "title already exists"})
                         }
            
                    //Checking if ISBN is unique or not
                    let uniqueISBN = await bookModel.findOne({ISBN : isbn})
                    if (uniqueISBN) {
                        return res.status(400).send({status: false , message: "ISBN already exists"})
                    }
            
                    let price = await bookModel.findOne({price: Price})
                    if(price){
                        return res.status(400).send({status: false, msg: "Enter new price"})
                    }
                    //Updating a book document
                    let updatedBook = await bookModel.findOneAndUpdate({ _id: book_Id },
                        {
                            $set: {
                                title: Title , ISBN: isbn, price: Price
                            }
                        }, { new: true })
            
                    //Sending the updated response
                    return res.status(200).send({ status: true, message: "Your Book details have been successfully updated", data: updatedBook })
                }
            
                //Exceptional error handling
                catch (error) {
                    console.log(error.message)
                    return res.status(500).send({ status: false, message: error.message })
                }
            }

//--------------------------------------------------------Delete Book---------------------------------------------------//

    const removeBook = async function (req, res) {
        try {
            let book_Id = req.params.bookId
            //Validate: The bookId is valid or not.
            let Book = await bookModel.findById(book_Id)
            if (!Book) return res.status(404).send({ status: false, message: "Book does not exists" })
    
            //Validate: If the bookId exists (must have isDeleted false)
            let is_Deleted = Book.isDeleted
            if (is_Deleted == true) return res.status(404).send({ status: false, message: "This Book is out of stock" })
    
            //Deleting a book document by its book_Id
            let deletedBook = await bookModel.findOneAndUpdate({ _id: book_Id },
                {
                    $set: {
                       isDeleted: true 
                    }
                }, { new: true })
    
            //Sending the deleted book document in response
            return res.status(200).send({ status: true, message: "Your Book details have been successfully deleted", data: deletedBook })
        }
    
        //Exceptional error handling
        catch (error) {
            console.log(error.message)
            return res.status(500).send({ status: false, message: error.message })
        }
    }


module.exports = {
    addBook,
    getBooks,
    updateBook,
    removeBook
}