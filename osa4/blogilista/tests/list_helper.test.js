import { test, describe } from 'node:test'
import { strictEqual, deepStrictEqual } from 'node:assert'
import { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes } from '../utils/list_helper.js'

test('dummy returns one', () => {
  const blogs = []

  const result = dummy(blogs)
  strictEqual(result, 1)
})

const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]
describe('list helpers', () => {
  describe('total likes', () => {
    
      test('of single blog is calculated right', () => {
        const result = totalLikes(listWithOneBlog)
        strictEqual(result, 5)
      })

      test('of multiple blogs is calculated right', () => {
          strictEqual(totalLikes(blogs), 36)
      })

      test('of no blogs is zero', () => {
          strictEqual(totalLikes([]), 0)
      })
    })

  describe('favourite blog', () => {

      test('is correct among multiple blogs', () => {
          deepStrictEqual(favoriteBlog(blogs), blogs[2])
      })

      test('is correct among one blog', () => {
          deepStrictEqual(favoriteBlog(listWithOneBlog), listWithOneBlog[0])
      })
  })

  describe('most blogs', () => {

    test('is correct among multiple blogs', () => {
        deepStrictEqual(mostBlogs(blogs), {'author': 'Robert C. Martin', 'blogs': 3})
    })

    test('is correct among one blog', () => {
        deepStrictEqual(mostBlogs(listWithOneBlog), {'author': 'Edsger W. Dijkstra', 'blogs': 1})
    })
  })

  describe('most likes', () => {

    test('is correct among multiple blogs', () => {
        deepStrictEqual(mostLikes(blogs), {'author': 'Edsger W. Dijkstra', 'likes': 17})
    })

    test('is correct among one blog', () => {
        deepStrictEqual(mostLikes(listWithOneBlog), {'author': 'Edsger W. Dijkstra', 'likes': 5})
    })
  })
})