


function transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

export {
    transposeMatrix,
}