import _ from 'lodash'

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let likesCount = 0
    for (let blog of blogs) {
        likesCount += blog.likes
    }
    return likesCount
}

const favoriteBlog = (blogs) => {
    let favoriteIdx = NaN
    let maxCount = 0
    let i = 0
    for (let blog of blogs) {
        if (blog.likes > maxCount) {
            favoriteIdx = i
            maxCount = blog.likes
        }
        ++i
    }
    return blogs[favoriteIdx]
}

const mostBlogs = (blogs) => {
    let x = _.countBy(blogs, (blog) => blog.author)
    x = _.toPairs(x)
    x = _.sortBy(x, (pair) => pair[1])
    x = _.reverse(x)
    return {'author': x[0][0], 'blogs': x[0][1]}
}

const mostLikes = (blogs) => {
    function func(acc, value) {
        if (_.has(acc, value.author)) {
            acc[value.author] = acc[value.author] + value.likes
        } else {
            acc[value.author] = value.likes
        }
        return acc
    }

    let x = _.reduce(blogs, func, {})
    x = _.toPairs(x)
    x = _.sortBy(x, (pair) => pair[1])
    x = _.reverse(x)
    return {'author': x[0][0], 'likes': x[0][1]}

}
  
export { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }