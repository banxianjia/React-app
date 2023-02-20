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
        const result = { winner: squares[a], mode: lines[i] };
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return result;
        }
    }
    return { winner: null, mode: [] };
}

// 格子函数组件
function Square(props) {
    return (
        <button
            className='square'
            onClick={props.onClick}
            style={props.winLine.indexOf(props.index) !== -1 ? { background: "#90EE90" } : {}}
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
            key={i}
            index={i}
            winLine={this.props.winLine}
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
                step: null,
                xy: null,
            }],
            // 当前步数
            stepNumber: 0,
            // 下一步是x嘛
            xIsNext: true,
            // 升序或降序
            isAsc: true,
        }
    }
    // 处理点击格子
    handleClick(i) {
        // 复制历史，从start到点击前的   slice(start,end)不包括end
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1];
        const squares = current.squares.slice()
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
                xy: i,
                step: history.length,
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
    ascMoves() {
        this.setState({
            isAsc: true
        })
    }
    desMoves() {
        this.setState({
            isAsc: false
        })
    }
    render() {
        var history = this.state.history
        const current = history[this.state.stepNumber];
        const result = calculateWinner(current.squares)
        const winner = result.winner

        var moves = history.map((item, move) => {
            const x = item.xy % 3 + 1;
            const y = Math.floor(item.xy / 3) + 1
            const desc = move ? 'Gop to move #' + item.step + '(列号：' + x + ',行号：' + y + ')' : 'Go to game start'
            return (
                <li key={move}>
                    <button style={this.state.stepNumber === move ? { fontWeight: 800 } : {}} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        if (!this.state.isAsc) {
            moves = moves.reverse()
        }
        let status;
        if (winner) {
            status = 'winner: ' + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        if (this.state.stepNumber === 9 && winner === null) {
            status = 'The game ended in a tie.'
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winLine={result.mode}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => { this.ascMoves() }}>升序</button>
                    <button onClick={() => { this.desMoves() }}>降序</button>
                    <ul>{moves}</ul>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
