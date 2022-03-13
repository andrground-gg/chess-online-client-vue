import { DefaultEventsMap } from '@socket.io/component-emitter';
import { io, Socket } from 'socket.io-client';
import { server } from '@/helper';

class SocketioService {
  socket!: Socket<DefaultEventsMap, DefaultEventsMap>;
  constructor() {}

  setupSocketConnection(): void {
    this.socket = io(server.baseURL);
  }
  getSocket(): Socket<DefaultEventsMap, DefaultEventsMap> {
    return this.socket;
  }
  startSearch(mode: string, timeMode: string, username: string, elo: number) {
    this.socket.emit('startSearch', {
      mode,
      timeMode,
      username,
      elo
    });
  }
  cancelSearch(mode: string, timeMode: string, username: string) {
    this.socket.emit('cancelSearch', {
      mode,
      timeMode,
      username,
    });
  }
  joinChat(id: string) {
    this.socket.emit('joinChat', { id })
  }
  leaveChat(id: string) {
    this.socket.emit('leaveChat', { id });
  }
  sendMessage(id: string, username: string, content: string) {
    this.socket.emit('sendMessage', {
      id,
      username,
      content,
    });
  }
  madeMove(id: string, board: string[][], whiteCastling: { WKSC: boolean, WQSC: boolean }, blackCastling: { BKSC: boolean, BQSC: boolean }, enPassant: { isAvailable: boolean, passingPawn: number[], captureSquare: number[] }, isCheck: boolean) {
    this.socket.emit('madeMove', {
      id,
      board,
      whiteCastling,
      blackCastling,
      enPassant,
      isCheck
    });
  }
  startTimer(id: string, time: number, increment: number, board: string[][], mode: string, whiteName: string, blackName: string, whiteElo: number, blackElo: number ) {
    this.socket.emit('startTimer', {
      id,
      time,
      increment,
      board,
      mode,
      whiteName,
      blackName,
      whiteElo,
      blackElo
    });
  }
  getGameData(id: string) {
    this.socket.emit('getGameData', {
      id
    });
  }
  offerDraw(id: string) {
    this.socket.emit('offerDraw', { id });
  }
  endGame(id: string, mode: string, white: { username: string, score: number, oldElo: number }, black: { username: string, score: number, oldElo: number }, moves: number) {
    this.socket.emit('endGame', {
      id,
      mode,
      white,
      black,
      moves
    });
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    } 
  }
}

export default new SocketioService();