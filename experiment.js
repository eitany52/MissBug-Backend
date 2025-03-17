const climbStairs = function (n) {
    if (n === 1) return 1
    const dp = [1, 2]
    for (let i = 2; i < n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }
    return dp.at(-1)
}

function getMinTeamSize(startTime, endTime) {
    let count = 1
    let finalTeamSize = 1
    for (let i = 0; i < startTime.length; i++) {
        for (let j = 0; j < endTime.length; j++) {
            if (i !== j) {
                if ((startTime[i] <= startTime[j] && endTime[i] >= startTime[j]) ||
                    (startTime[i] >= startTime[j] && endTime[i] <= endTime[j])) {
                    count++
                }
            }
        }
        if (count > finalTeamSize) finalTeamSize = count
    }

    return finalTeamSize
}

const isPalindrome1 = function (x) {
    // 1212121
    let numStr = x.toString()
    for (let i = 0, j = numStr.length - 1; i < Math.ceil(numStr.length / 2); i++, j--) {
        if (numStr[i] !== numStr[j]) return false
    }

    return true
};

const isPalindrome2 = function (x) {
    // 1212121
    const numStr = x.toString()
    const numStrReverse = Array.from(numStr).reverse().join("")
    return numStr === numStrReverse
};

const isPalindrome3 = function (x) {
    // 121121
    if (Math.floor(x / 10) === 0) return true
    const str = x.toString()
    if (str[0] != x % 10) return false
    return isPalindrome3(str.substring(1, str.length - 1))
}

let str = "-500"
console.log(str[0]);








































































class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.left = new TreeNode(6);
root.right.right = new TreeNode(7);

function bfs(root) {
    if (!root) return
    const queue = [root]
    while (queue.length) {
        const node = queue.shift()
        console.log(node.value);
        if (node.left) queue.push(node.left)
        if (node.right) queue.push(node.right)
    }
}

function preOrder(root) {
    if (!root) return

    const stack = [root]
    while (stack.length) {
        const node = stack.pop()
        console.log(node.value);
        if (node.right) stack.push(node.right)
        if (node.left) stack.push(node.left)
    }
}

function inOrder(root) {
    const stack = []
    let current = root
    while (current || stack.length) {
        while (current) {
            stack.push(current)
            current = current.left
        }
        current = stack.pop()
        console.log(current.value);
        current = current.right
    }
}
























// Column-wise Traversal (Top to Bottom)
// const matrix = [
//    [1, 2, 3],
//    [4, 5, 6],
//    [7, 8, 9]
//];
// for (let j = 0; j < matrix[0].length; j++) {
//     for (let i = 0; i < matrix.length; i++) {
//         console.log(matrix[i][j]);
//     }
// }

// function searchMatrix(matrix, target) {
// const matrix = [
//    [1, 2, 3],
//    [4, 5, 6],
//    [7, 8, 9]
//];
//     let row = 0, col = matrix[0].length - 1;

//     while (row < matrix.length && col >= 0) {
//         if (matrix[row][col] === target) return true;
//         if (matrix[row][col] > target) col--;
//         else row++;
//     }
//     return false;
// }




const zigzagTraversal = function (grid) {
    // Input: grid = ] 
    // [1,2,3],
    // [4,5,6],
    // [7,8,9]]
    // Output: [1,3,5,7,9]
    let row = 0
    let col = 0
    let isItemToSave = true
    let result = []
    while (row < grid.length) {
        col = row % 2 === 0 ? 0 : grid[row].length - 1
        while (row % 2 === 0 ? col < grid[row].length : col >= 0) {
            if (isItemToSave) {
                result.push(grid[row][col])
                isItemToSave = false
            }
            else isItemToSave = true
            col = row % 2 === 0 ? col + 1 : col - 1
        }
        row++
    }

    return result
};







// const str = `["abc123","abc345","abc567"]`
// const arr = ["abc123", "deb454", "hgfh2134"]
// console.log(arr.includes("hgfh2134"))

// const str = 'abc,def,gfdg,cvxesdf'
// const arr = str.split(',')
// console.log(arr);
// console.log(typeof arr);






// const regExp = new RegExp(["hello", "world"], 'i')
// const strs = ["HELLO", "world", "Eitan", "Speaking"]
// console.log(regExp.test(strs))


// const regExp = new RegExp(["HELLO", "world", "Eitan", "Speaking"], 'i')
// const strs = ["hello", "world"]
// console.log(regExp.test(strs))


// const regExp = new RegExp(["HELLO", "world", "Eitan", "Speaking"], 'i')
// const str = "hello"
// console.log(regExp.test(str))

// const regExp = new RegExp("hello", 'i')
// const strs = ["HELLO", "world", "Eitan", "Speaking"]

// console.log(regExp.test(strs))

// const regExp = new RegExp("hello", 'i')
// const str = "hell"
// console.log(regExp.test(str))


// const regExp = new RegExp("hell", 'i')
// const str = "hello"
// console.log(regExp.test(str))

