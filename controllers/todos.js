const Todo = require('../models/Todo')

let movieTitle
let image 

module.exports = {
    getTodos: async (req,res)=>{
        console.log(req.user)
        try{
            const todoItems = await Todo.find({userId:req.user.id})
            const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req, res)=>{
        try{
            let search = req.body.todoItem.replace(" ", "+")
            const url = `https://api.themoviedb.org/3/search/movie?api_key=9ac0eb557b1857810d37cbef8fd0557b&query=${search}`

            //pass request of user input to the movie api to get title and image from api
            await fetch(url)
                .then(res => res.json()) // parse response as JSON
                .then(data => { 
                movieTitle = data.results[0].original_title
                image = `https://image.tmdb.org/t/p/original/${data.results[0].poster_path}`
                })
                .catch(err => {
                    console.log(`error out possible bad search query? ${err}`)
                    movieTitle = ""
                });
                //if movietitle was found in the api add it to the list
                console.log(movieTitle)
                if(movieTitle.length > 1){
                        await Todo.create({todo: req.body.todoItem, completed: false, title: movieTitle, image: image, userId: req.user.id})
                        console.log('Todo has been added!')
                        res.redirect('/todos')

                }
                //if the movie title was not found in the database send a flash error to the user letting them know.
                else{   
                    console.log('Movie was not found or added!')
                    req.flash("errors", `Could not find ${req.body.todoItem}please try another search`)
                    res.redirect('/todos')
                    let movieTitle = "" 
                }
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    