var express = require('express');
var app = express();

//let comments = [];  // 빈 리스트 만들기, 사실상 이게 휘발성 DB
const { Sequelize, DataTypes } = require('sequelize');
//const sequelize = new Sequelize('sqlite::memory:'); // 메모리에 DB를 올려서 사용
const sequelize = new Sequelize({  // 파일로 저장하는 방식
    dialect: 'sqlite',
    storage: 'database.sqlite'
  });

const Comments = sequelize.define('Comments',{
    // Model attributes are defined here
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
  },
);

//await Comments.sync({ force: true });  // force : true는 초기화 옵션
(async () => {
await Comments.sync();  // force : true는 초기화 옵션
console.log('The table for the User model was just (re)created!');
})();
// `sequelize.define` also returns the model
console.log(Comments === sequelize.models.Comments); // true


app.use(express.json()) // json을 위한 파싱
app.use(express.urlencoded({extended: true})) // 폼테그(바디)를 위한 파싱
// set the view engine to ejs
app.set('view engine', 'ejs'); // ejs라는 view 엔진을 사용할 거다.

// use res.render to load up an ejs view file

// index page // index.ejs 요청 하기 num 변수에 3을 싣기
app.get('/', async function(req, res) {
    // CRUD 중 READ 부분
    const comments = await Comments.findAll(); // Comments 테이블로 부터 읽어오기
    //console.log(comments)
    res.render('index', { comments: comments });  // view라는 폴더 아래 index.ejs(뷰)를 읽어 들임
});

  
app.post('/create', async function(req, res) {
    //res.render('index', {num: 3});  // view라는 폴더 아래 index.ejs(뷰)를 읽어 들임
    console.log(req.body) // 프론트로 부터 전달 받은 변수 출력하기

    const { content } = req.body
    //comments.push(content)   // python 의 append와 같은 함수
    
    // Create a new comments
    // CRUD 중 CREATE 부분
    await Comments.create({ content: content });  // Comments 테이블에 생성
    
    //res.send('hi')
    res.redirect('/')
});

app.post('/update/:id', async function(req, res) {
    //res.render('index', {num: 3});  // view라는 폴더 아래 index.ejs(뷰)를 읽어 들임
    console.log(req.params)
    console.log(req.body) // 프론트로 부터 전달 받은 변수 출력하기

    const { content } = req.body
    const { id } = req.params
    //comments.push(content)   // python 의 append와 같은 함수
    
    // Update a new comments
    // CRUD 중 UPDATE 부분
    await Comments.update(
        { content: content },
        {
          where: {
            id: id,
          },
        },
      );
    
    //res.send('hi')
    res.redirect('/')
});

app.post('/delete/:id', async function(req, res) {
    //res.render('index', {num: 3});  // view라는 폴더 아래 index.ejs(뷰)를 읽어 들임
    console.log(req.params)
    const { id } = req.params
    //comments.push(content)   // python 의 append와 같은 함수
    
    // Update a new comments
    // CRUD 중 UPDATE 부분
    await Comments.destroy({
        where: {
          id: id,
        },
      });
    
    //res.send('hi')
    res.redirect('/')
});

app.listen(3333);
console.log('Server is listening on port 3333');