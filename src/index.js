import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// 判断胜负
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// 格子函数组件
function Square(props) {
    return (
        <button
            className='square'
            onClick={props.onClick}
        >
            {props.value}
        </button>
    )
}

// 表格组件
class Board extends React.Component {
    // 渲染格子
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        const squares = this.props.squares;
        let newArr = [];
        for (let i = 0; i < 3; i++) {
            newArr.push(squares.slice(i * 3, (i + 1) * 3))
        }
        return (
            <div>
                {
                    newArr.map((item, y) => (
                        <div className="board-row" key={y}>
                            {item.map((value, x) => (this.renderSquare(y * 3 + x)))}
                        </div>
                    ))
                }
                {/* <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div> */}
            </div>
        );
    }
}

// 游戏组件
class Game extends React.Component {
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            // 历史数组，每一项是个对象，对象中的squares是棋盘数组，长度为9
            history: [{
                squares: Array(9).fill(null),
                xy: null,
            }],
            // 当前步数
            stepNumber: 0,
            // 下一步是x嘛
            xIsNext: true,
        }
    }
    // 处理点击格子
    handleClick(i) {
        // 复制历史，从start到点击前的   slice(start,end)不包括end
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1];
        const squares = current.squares.slice()
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
                xy: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }
    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares)

        const moves = history.map((step, move) => {
            const x = step.xy % 3 + 1;
            const y = Math.floor(step.xy / 3) + 1
            const desc = move ? 'Gop to move #' + move + '(列号：' + x + ',行号：' + y + ')' : 'Go to game start'
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        let status;
        if (winner) {
            status = 'winner: ' + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
