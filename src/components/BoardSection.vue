<template>
  <div class="layout-board-section">
    <div class="layout__player layout__player--top">
      <p class="player__info">
        <router-link 
          v-if="gameStarted && gameData?._id"
          :to="`/profile/${!isFlipped ? gameData?.black?.username : gameData?.white?.username}`"
        >{{!isFlipped ? gameData?.black?.username : gameData?.white?.username}}
        </router-link>
        <span v-else>
          {{"Opponent"}}
        </span>
        {{gameStarted && gameData?._id ? `(${!isFlipped ? gameData?.black?.eloAtTheTime : gameData?.white?.eloAtTheTime})` : ""}}
      </p>
      <div v-if="whiteTime !== -1 && gameStarted && gameData?._id" class="player__timer">
        <span>{{ new Date((!isFlipped ? blackTime : whiteTime) * 1000).toISOString().substr(14, 5) }}</span>
      </div>
    </div>
    <div 
      :class="['layout__board', isFlipped ? 'flipped' : '']"
      @mousedown="resetBoard"
    >
      <div v-for="index in 64" :key="index" class="square"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece br square-18"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bn square-28"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bb square-38"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bq square-48"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bk square-58"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bb square-68"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bn square-78"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece br square-88"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bp square-17"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bp square-27"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bp square-37"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bp square-47"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bp square-57"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bp square-67"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bp square-77"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece bp square-87"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wr square-11"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wn square-21"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wb square-31"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wq square-41"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wk square-51"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wb square-61"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wn square-71"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wr square-81"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wp square-12"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wp square-22"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wp square-32"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wp square-42"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wp square-52"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wp square-62"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wp square-72"></div>
      <div v-show="joinedChat && gotData || !gameStarted" @mousedown="startMoving" class="piece wp square-82"></div>
    </div>
    <div class="layout__player layout__player--bottom">
      <p class="player__info">
        <router-link
          v-if="gameStarted && gameData?._id && user?.username"
          :to="`/profile/${!isFlipped ? gameData?.white?.username : gameData?.black?.username}`"
        >
          {{!isFlipped ? gameData?.white?.username : gameData?.black?.username}}
        </router-link>
        <span v-else>
          {{user?.username ?? "User"}}
        </span>
        {{gameStarted && gameData?._id ? `(${!isFlipped ? gameData?.white?.eloAtTheTime : gameData?.black?.eloAtTheTime})` : ""}}
      </p>
      <div v-if="whiteTime !== -1 && gameStarted && gameData?._id" class="player__timer">
        <span>{{ new Date((!isFlipped ? whiteTime : blackTime) * 1000).toISOString().substr(14, 5) }}</span>
      </div>
    </div>
    <ModalPromotion
      v-if="isModalVisible"
      @closeModal="closeModal"
      @choosePiece="(name) => choosePromotionPiece(name)"
      :color="user.username === gameData.white.username ? 'white' : 'black'"
    ></ModalPromotion>
  </div>
</template>

<script lang="ts">
import { Store, useStore } from 'vuex';
import { computed, ComputedRef, onMounted, onUnmounted, Ref, ref, watch } from 'vue';
import SocketioService from '@/services/socketio.service';
import { Socket } from 'socket.io-client';
import ModalPromotion from '@/components/ModalPromotion.vue'

export default {
  props: {
    gameData: {
      required: false,
      type: Object
    },
    gameStarted: {
      required: true,
      type: Boolean
    },
    joinedChat: {
      required: true,
      type: Boolean
    }
  },
  setup(props: any, { emit }: any): Record<string, unknown> {
    const store: Store<any> = useStore();
    const socket: Socket = SocketioService.getSocket();

    let board: string[][] = [
      ['R','N','B','K','Q','B','N','R'],
      ['P','P','P','P','P','P','P','P'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['p','p','p','p','p','p','p','p'],
      ['r','n','b','k','q','b','n','r'],
    ];

    let isModalVisible: Ref<boolean> = ref(false);

    let user: ComputedRef<Record<string, unknown>> = computed(() => store.getters.user);
    let isWhiteTurn = true;
    let sentMadeMove = false;
    let whiteCastling = {
      WKSC: true,
      WQSC: true
    };
    let blackCastling = {
      BKSC: true,
      BQSC: true
    };
    let enPassant: { isAvailable: boolean, passingPawn: number[], captureSquare: number[] } = {
      isAvailable: false,
      passingPawn: [],
      captureSquare: []
    }
    let isCheck = false;
    let whiteTime: Ref<number> = ref(-1);
    let blackTime: Ref<number> = ref(-1);
    let isPromotion = false;
    let gotData: Ref<boolean> = ref(false);

    onMounted(() => {
      if (props.gameData?._id) {
        SocketioService.startTimer(props.gameData._id, props.gameData.timeMode.split('|')[0] * 60, parseInt(props.gameData.timeMode.split('|')[1]) ?? 0, board, props.gameData.mode, props.gameData.white.username, props.gameData.black.username, props.gameData.white.eloAtTheTime, props.gameData.black.eloAtTheTime);
        SocketioService.getGameData(props.gameData._id);
      }
    });
    watch(() => props.gameData, () => {
      SocketioService.startTimer(props.gameData._id, props.gameData.timeMode.split('|')[0] * 60, parseInt(props.gameData.timeMode.split('|')[1]) ?? 0, board, props.gameData.mode, props.gameData.white.username, props.gameData.black.username, props.gameData.white.eloAtTheTime, props.gameData.black.eloAtTheTime);
      SocketioService.getGameData(props.gameData._id);
    });
    socket.on('sendData', (payload: { board: string[][], isWhiteTurn: boolean, moves: number, whiteCastling: { WKSC: boolean, WQSC: boolean }, blackCastling: { BKSC: boolean, BQSC: boolean }, enPassant: { isAvailable: boolean, passingPawn: number[], captureSquare: number[] }, isCheck: boolean }) => {
      isWhiteTurn = payload.isWhiteTurn;
      whiteCastling = payload.whiteCastling;
      blackCastling = payload.blackCastling;
      enPassant = payload.enPassant;
      isCheck = payload.isCheck;
      board = payload.board;
      
      gotData.value = true;
      resetBoard();
    });
    socket.on('sendTime', (payload: { whiteTime: number, blackTime: number}) => {
      whiteTime.value = payload.whiteTime;
      blackTime.value = payload.blackTime;
    });

    let isFlipped: ComputedRef<boolean> = computed(() => user.value?.username != null && user.value?.username === props.gameData?.black?.username);
    
    socket.on('madeMove', (payload: { board: string[][], isWhiteTurn: boolean, moves: number, whiteCastling: { WKSC: boolean, WQSC: boolean }, blackCastling: { BKSC: boolean, BQSC: boolean }, enPassant: { isAvailable: boolean, passingPawn: number[], captureSquare: number[] }, isCheck: boolean }) => {
      isWhiteTurn = payload.isWhiteTurn;
      whiteCastling = payload.whiteCastling;
      blackCastling = payload.blackCastling;
      enPassant = payload.enPassant;
      isCheck = payload.isCheck;
      emit('setMoves', payload.moves);
      if (!sentMadeMove) {
        board = payload.board;
        resetBoard();
      }
      else {
        sentMadeMove = false;
      }
    });
    onUnmounted(() => {
      socket.off('madeMove');
      socket.off('sendTime');
      socket.off('sendData');
    })

    const resetBoard = () => {
      let pieces = Array.from(document.querySelectorAll('.piece'));
      let freePieces = [];
      freePieces.push(...Array.from(document.querySelectorAll('.element-pool')));
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === '') {
            let squareClass = `square-${8 - j}${i + 1}`; 
            let checkPiece = pieces.find((p: Element) => Array.from(p.classList).includes(squareClass));
            if (checkPiece) {
              freePieces.push(checkPiece);
            }
          }
        }
      }
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] !== '') {
            let newSquareClass = `square-${8 - j}${i + 1}`;
            let newPieceClass = board[i][j] === board[i][j].toLowerCase() ? 'b' + board[i][j] : 'w' + board[i][j].toLowerCase();

            let alreadyPiece = pieces.find((p: Element) => Array.from(p.classList).includes(newSquareClass) && Array.from(p.classList).includes(newPieceClass));
            if (alreadyPiece) {
              pieces = pieces.filter(p => p !== alreadyPiece);
              continue;
            }

            let pieceOnSquare = pieces.find((p: Element) => Array.from(p.classList).includes(newSquareClass));
            if (pieceOnSquare)
              freePieces.push(pieceOnSquare);

            let piece: Element = freePieces[0];
            if (piece) {
              freePieces = freePieces.filter((p: Element) => p !== piece);
              let squareClass: string = [...piece.classList].find(cl => cl.includes('square'))!;
              let pieceClass: string = [...piece.classList].find(cl => cl.includes('w') || cl.includes('b'))!;
              if (squareClass)
                piece.classList.remove(squareClass);
              if (pieceClass)
                piece.classList.remove(pieceClass);
              if (!Array.from(piece.classList).includes('piece')) {
                piece.classList.add('piece');
                piece.classList.remove('element-pool');
              }
              piece.classList.add(newSquareClass);
              piece.classList.add(newPieceClass);
            }
          }
        }
      }
      for(let i = 0; i < freePieces.length; i++) {
        freePieces[i].className = 'element-pool';
      }
    }
    const getPosRelativeToBoard = (e: any, piece: any) => {
      let rect: DOMRect = document.querySelector('.layout__board')!.getBoundingClientRect();
      let offsetX: number = e.clientX - rect.left; 
      let offsetY: number = e.clientY - rect.top; 

      let pieceWidth: number = piece.offsetWidth;
      let pieceHeight: number = piece.offsetHeight;

      let translateX: number = (offsetX - pieceWidth / 2) / pieceWidth * 100;
      if (translateX > 750)
        translateX = 750;
      if (translateX < -50)
        translateX = -50;

      let translateY: number = (offsetY - pieceHeight / 2) / pieceHeight * 100;
      if (translateY > 750)
        translateY = 750;
      if (translateY < -50)
        translateY = -50;

      return [translateX, translateY];
    }
    const getTileOnBoard = (e: any, piece: any) => {
      let pos: number[] = getPosRelativeToBoard(e, piece);
      let translateX: number = pos[0]
      let translateY: number = pos[1]

      let col = Math.ceil((translateX + 50) / 100);
      let row = 9 - Math.ceil((translateY + 50.01) / 100);
      if (col === 0) col = 1;
      if (row === 0) row = 1;

      if (isFlipped.value) {
        col = 9 - col;
        row = 9 - row;
      }

      return [row, col];
    }

    let movingPiece: any;
    let legalMoves: number[][];
    let initialPos: number[];
    const applyMovement = (e: any) => {
      let pos: number[] = getPosRelativeToBoard(e, movingPiece);

      movingPiece.style.transform = `translate(${pos[0].toString()}%, ${pos[1].toString()}%)`;
    }
    const movePiece = (e: any) => {
      applyMovement(e);
      let tilePos: number[] = getTileOnBoard(e, movingPiece);

      const squares = Array.from(document.querySelectorAll('.square'));

      let outlinedSquare = squares.find((el: Element) => Array.from(el.classList).includes('outlined'))
      if (outlinedSquare)
        outlinedSquare.classList.remove('outlined');

      let index = (8 - tilePos[0]) * 8 + tilePos[1] - 1;
      if (isFlipped.value) 
        index = 63 - index;

      squares[index].classList.add('outlined');
    }
    const startMoving = (e: any) => {
      if (!props.gameStarted)
        return;

      if (e.which !== 1)
        return;

      if ((user?.value.username === props.gameData?.black?.username && isWhiteTurn) || (user?.value.username === props.gameData?.white?.username && !isWhiteTurn))
        return;

      let tilePos: number[] = getTileOnBoard(e, e.target);
      let boardElem = board[tilePos[0] - 1][8 - tilePos[1]];
      if (boardElem === '')
        return;
      if (boardElem !== (user?.value.username === props.gameData?.white?.username ? boardElem.toUpperCase() : boardElem.toLowerCase()))
        return;

      const squares = Array.from(document.querySelectorAll('.square'));
      let index = (8 - tilePos[0]) * 8 + tilePos[1] - 1;
      if (isFlipped.value) 
        index = 63 - index;
      
      squares[index].classList.add('highlighted');
      squares[index].classList.add('outlined');

      movingPiece = e.target;
      initialPos = tilePos;
      applyMovement(e);

      const pieceName = board[initialPos[0] - 1][8 - initialPos[1]];
      legalMoves = findLegalMoves(pieceName.toLowerCase(), pieceName !== pieceName.toLowerCase(), initialPos[0] - 1, 8 - initialPos[1], true);
      for(let i = 0; i < legalMoves.length; i++) {
        let index = 63 - ((legalMoves[i][0]) * 8 + legalMoves[i][1]);
        if (isFlipped.value)
          index = 63 - index;

        squares[index].classList.add('legal');
      }

      movingPiece.classList.add('dragging');
      document.addEventListener('mousemove', movePiece);
    }
    const findLegalMoves = (pieceName: string, isPieceWhite: boolean, row: number, col: number, forNextMove: boolean): number[][] => {
      let moves: number[][] = [];
      if (pieceName === 'r' || pieceName === 'q') {
        for (let i = 1; i <= row; i++) {
          moves.push([row - i, col]);
          if (board[row - i][col] !== '') {
            if (isAllyPieceOnPos(row - i, col, isPieceWhite) && forNextMove)
              moves.pop();
            break;
          }
        }
        for (let i = 1; i < 8 - row; i++) {
          moves.push([row + i, col]);
          let placeOnBoard = board[row + i][col];
          if (placeOnBoard !== '') {
            if (isAllyPieceOnPos(row + i, col, isPieceWhite) && forNextMove)
              moves.pop();
            break;
          }
        }
        for (let i = 1; i <= col; i++) {
          moves.push([row, col - i]);
          if (board[row][col - i] !== '') {
            if (isAllyPieceOnPos(row, col - i, isPieceWhite) && forNextMove)
              moves.pop();
            break;
          }
        }
        for (let i = 1; i < 8 - col; i++) {
          moves.push([row, col + i]);
          if (board[row][col + i] !== '') {
            if (isAllyPieceOnPos(row, col + i, isPieceWhite) && forNextMove)
              moves.pop();
            break;
          }
        }
      }
      if (pieceName === 'b' || pieceName === 'q') { 
        for (let i = 1; i <= (row < col ? row : col); i++) {
          moves.push([row - i, col - i]);
          if (board[row - i][col - i] !== '') {
            if (isAllyPieceOnPos(row - i, col - i, isPieceWhite) && forNextMove)
              moves.pop();
            break;
          }
        }
        for (let i = 1; i <= (row < 7 - col ? row : 7 - col); i++) {
          moves.push([row - i, col + i]);
          if (board[row - i][col + i] !== '') {
            if (isAllyPieceOnPos(row - i, col + i, isPieceWhite) && forNextMove)
              moves.pop();
            break;
          }
        }
        for (let i = 1; i <= (7 - row < col ? 7 - row : col); i++) {
          moves.push([row + i, col - i]);
          if (board[row + i][col - i] !== '') {
            if (isAllyPieceOnPos(row + i, col - i, isPieceWhite) && forNextMove)
              moves.pop();
            break;
          }
        }
        for (let i = 1; i < (8 - row < 8 - col ? 8 - row : 8 - col); i++) {
          moves.push([row + i, col + i]);
          if (board[row + i][col + i] !== '') {
            if (isAllyPieceOnPos(row + i, col + i, isPieceWhite) && forNextMove)
              moves.pop();
            break;
          }
        }  
      }
      else if (pieceName === 'p') {
        if (isPieceWhite) {
          if (forNextMove && board[row + 1][col] === '') {
            moves.push([row + 1, col]);
            if (row === 1 && board[row + 2][col] === '')
              moves.push([row + 2, col]);
          }
          if (col - 1 >= 0 && row + 1 < 8 && ((!isAllyPieceOnPos(row + 1, col - 1, isPieceWhite) && board[row + 1][col - 1] !== '') || !forNextMove)) {
            moves.push([row + 1, col - 1]);
          }
          if (col + 1 < 8 && row + 1 < 8 && ((!isAllyPieceOnPos(row + 1, col + 1, isPieceWhite) && board[row + 1][col + 1] !== '') || !forNextMove)) {
            moves.push([row + 1, col + 1]);
          }
          if (forNextMove && enPassant.isAvailable) {
            if (enPassant.captureSquare[0] === row + 1 && (enPassant.passingPawn[1] === col + 1 || enPassant.passingPawn[1] === col - 1)) {
              moves.push(enPassant.captureSquare);
            }
          }
        }
        else {
          if (forNextMove && board[row - 1][col] === '') {
            moves.push([row - 1, col]);
            if (row === 6 && board[row - 2][col] === '')
              moves.push([row - 2, col]);
          }
          if (col - 1 >= 0 && row - 1 >= 0 && ((!isAllyPieceOnPos(row - 1, col - 1, isPieceWhite) && board[row - 1][col - 1] !== '') || !forNextMove)) {
            moves.push([row - 1, col - 1]);
          }
          if (col + 1 < 8 && row - 1 >= 0 && ((!isAllyPieceOnPos(row - 1, col + 1, isPieceWhite) && board[row - 1][col + 1] !== '') || !forNextMove)) {
            moves.push([row - 1, col + 1]);
          }
          if (forNextMove && enPassant.isAvailable) {
            if (enPassant.captureSquare[0] === row - 1 && (enPassant.passingPawn[1] === col + 1 || enPassant.passingPawn[1] === col - 1)) {
              moves.push(enPassant.captureSquare);
            }
          }
        }
      }
      else if (pieceName === 'n') {
        if (row - 2 >= 0) {
          if (col - 1 >= 0 && (!isAllyPieceOnPos(row - 2, col - 1, isPieceWhite) || !forNextMove))
            moves.push([row - 2, col - 1]);
          if (col + 1 < 8 && (!isAllyPieceOnPos(row - 2, col + 1, isPieceWhite) || !forNextMove))
            moves.push([row - 2, col + 1]);
        }
        if (row + 2 < 8) {
          if (col - 1 >= 0 && (!isAllyPieceOnPos(row + 2, col - 1, isPieceWhite) || !forNextMove))
            moves.push([row + 2, col - 1]);
          if (col + 1 < 8 && (!isAllyPieceOnPos(row + 2, col + 1, isPieceWhite) || !forNextMove))
            moves.push([row + 2, col + 1]);
        }
        if (col - 2 >= 0) {
          if (row - 1 >= 0 && (!isAllyPieceOnPos(row - 1, col - 2, isPieceWhite) || !forNextMove))
            moves.push([row - 1, col - 2]);
          if (row + 1 < 8 && (!isAllyPieceOnPos(row + 1, col - 2, isPieceWhite) || !forNextMove))
            moves.push([row + 1, col - 2]);
        }
        if (col + 2 < 8) {
          if (row - 1 >= 0 && (!isAllyPieceOnPos(row - 1, col + 2, isPieceWhite) || !forNextMove))
            moves.push([row - 1, col + 2]);
          if (row + 1 < 8 && (!isAllyPieceOnPos(row + 1, col + 2, isPieceWhite) || !forNextMove))
            moves.push([row + 1, col + 2]);
        }
      }
      else if (pieceName === 'k') {
        if (row - 1 >= 0) {
          if (!isAllyPieceOnPos(row - 1, col, isPieceWhite) && !isUnderAttack(row - 1, col, isPieceWhite))
            moves.push([row - 1, col]);
          if (col - 1 >= 0 && !isAllyPieceOnPos(row - 1, col - 1, isPieceWhite) && !isUnderAttack(row - 1, col - 1, isPieceWhite))
            moves.push([row - 1, col - 1]);
          if (col + 1 < 8 && !isAllyPieceOnPos(row - 1, col + 1, isPieceWhite) && !isUnderAttack(row - 1, col + 1, isPieceWhite))
            moves.push([row - 1, col + 1]);
        }
        if (row + 1 < 8) {
          if (!isAllyPieceOnPos(row + 1, col, isPieceWhite) && !isUnderAttack(row + 1, col, isPieceWhite))
            moves.push([row + 1, col]);
          if (col - 1 >= 0 && !isAllyPieceOnPos(row + 1, col - 1, isPieceWhite) && !isUnderAttack(row + 1, col - 1, isPieceWhite))
            moves.push([row + 1, col - 1]);
          if (col + 1 < 8 && !isAllyPieceOnPos(row + 1, col + 1, isPieceWhite) && !isUnderAttack(row + 1, col + 1, isPieceWhite))
            moves.push([row + 1, col + 1]);
        }
        if (col - 1 >= 0 && !isAllyPieceOnPos(row, col - 1, isPieceWhite) && !isUnderAttack(row, col - 1, isPieceWhite))
          moves.push([row, col - 1]);
        if (col + 1 < 8 && !isAllyPieceOnPos(row, col + 1, isPieceWhite) && !isUnderAttack(row, col + 1, isPieceWhite))
          moves.push([row, col + 1]);

        if (!isCheck) {
          if (isPieceWhite) {
            if (whiteCastling.WKSC && board[0][1] === '' && board[0][2] === '' && !isUnderAttack(0, 1, isPieceWhite) && !isUnderAttack(0, 2, isPieceWhite))
              moves.push([0, 1]);
            if (whiteCastling.WQSC && board[0][4] === '' && board[0][5] === '' && board[0][6] === '' && !isUnderAttack(0, 4, isPieceWhite) && !isUnderAttack(0, 5, isPieceWhite) && !isUnderAttack(0, 6, isPieceWhite))
              moves.push([0, 5]);
          }
          else {
            if (blackCastling.BKSC && board[7][1] === '' && board[7][2] === ''  && !isUnderAttack(7, 1, isPieceWhite) && !isUnderAttack(7, 2, isPieceWhite))
              moves.push([7, 1]);
            if (blackCastling.BQSC && board[7][4] === '' && board[7][5] === '' && board[7][6] === ''  && !isUnderAttack(7, 4, isPieceWhite) && !isUnderAttack(7, 5, isPieceWhite) && !isUnderAttack(7, 6, isPieceWhite))
              moves.push([7, 5]);
          }
        }
      }

      
      if (forNextMove) {
        let attackingPaths = checkForAttackingPaths(!isPieceWhite);
        if (isCheck && pieceName !== 'k') {
          let king: number[] = []; 
          for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
              if (board[i][j] === (isPieceWhite ? 'K' : 'k'))
                king = [i, j];
            }
          }
          
          let attackingPieces = getAttackingPieces(king[0], king[1], isPieceWhite);
          if (attackingPieces.length === 1) {
            let i = 0;
            while (i < moves.length) {
              let attackingPath = attackingPaths.find((path: number[][] | undefined) => path?.find(s => s.toString() === moves[i].toString() && path?.find(s => s.toString() === attackingPieces[0].toString())));
              if (!attackingPath)
                moves.splice(i, 1);
              else
                i++;
            }
          }
          else if (attackingPieces.length > 1) {
            moves = [];
          }
        }

        if (attackingPaths.length !== 0) {
          let path = attackingPaths.find((p: number[][]) => p.find(s => s.toString() === [row, col].toString()));
          if (path) {
            let piecesOnAttackingPath = path.filter(p => board[p[0]][p[1]] !== '').length;
            if (piecesOnAttackingPath === 2) {
              let i = 0;
              while (i < moves.length) {
                if (!path.find(s => s.toString() === moves[i].toString()))
                  moves.splice(i, 1);
                else
                  i++;
              }
            }
          }
        }
      }

      return moves;
    }
    const isAllyPieceOnPos = (row: number, col: number, isPieceWhite: boolean): boolean => {
      return board[row][col] === (isPieceWhite ? board[row][col].toUpperCase() : board[row][col].toLowerCase()) && board[row][col] !== '';
    }
    const isUnderAttack = (row: number, col: number, isPieceWhite: boolean): boolean => {
      return getAttackingPieces(row, col, isPieceWhite).length > 0;
    }
    const getAttackingPieces = (row: number, col: number, isPieceWhite: boolean): number[][] => {
      let attackingPieces: number[][] = [];
      let enemyPieces: number[][] = [];
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] !== '' && board[i][j].toLowerCase() !== 'k') {
            if ((isPieceWhite && board[i][j] === board[i][j].toLowerCase()) || (!isPieceWhite && board[i][j] === board[i][j].toUpperCase()))
              enemyPieces.push([i, j]);
          }
        }
      }
      
      for (let piecePos of enemyPieces) {
        let pieceName = board[piecePos[0]][piecePos[1]];
        let moves = findLegalMoves(pieceName.toLowerCase(), pieceName !== pieceName.toLowerCase(), piecePos[0], piecePos[1], false);
        for (let move of moves) {
          if (row === move[0] && col === move[1])
            attackingPieces.push([piecePos[0], piecePos[1]]);
        }
      }

      return attackingPieces;
    }
    const checkForAttackingPaths = (isAttackingWhite: boolean): number[][][] => {
      let attackingPieces: { row: number, col: number, name: string }[] = [];
      let enemyKing: number[] = [];
      let totalPaths: number[][][] = [];
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] !== '' && board[i][j] === (isAttackingWhite ? board[i][j].toUpperCase() : board[i][j].toLowerCase())) {
            attackingPieces.push({
              row: i,
              col: j,
              name: board[i][j].toLowerCase()
            });
          }
          else if (board[i][j] === (isAttackingWhite ? 'k' : 'K')) {
            enemyKing = [i, j];
          }
        }
      }

      for(let piece of attackingPieces) {
        if (attackingPathExists(piece, enemyKing, isAttackingWhite)) {
          let path = findAttackingPath(piece, enemyKing);
          totalPaths.push(path);
        }
      }

      return totalPaths;
    }
    const attackingPathExists = (piece: { row: number, col: number, name: string }, enemyKing: number[], isAttackingWhite: boolean): boolean => {
      let row1 = piece.row;
      let col1 = piece.col;
      let row2 = enemyKing[0];
      let col2 = enemyKing[1];
      let i = 1;
      if (piece.name === 'b' || piece.name === 'q') {
        while (i < 8) {
          if (row1 + i === row2 && col1 + i === col2 || row1 - i === row2 && col1 + i === col2 || row1 + i === row2 && col1 - i === col2 || row1 - i === row2 && col1 - i === col2)
            return true;

          i++;
        }
      }
      if (piece.name === 'r' || piece.name === 'q') {
        if (row1 + i === row2 && col1 === col2 || row1 - i && col1 === col2 || row1 === row2 && col1 + i === col2 || row1 === row2 && col1 - i === col2)
          return true;

        i++;
      }
      else {
        if (findLegalMoves(piece.name, isAttackingWhite, row1, col1, false).find(ar => ar.toString() === enemyKing.toString())) {
          return true;
        }
      }

      return false;
    }
    const findAttackingPath = (piece: { row: number, col: number, name: string }, enemyKing: number[]): number[][] => {
      let path = [];
      let row1 = enemyKing[0];
      let col1 = enemyKing[1];
      let row2 = piece.row;
      let col2 = piece.col;
      if (piece.name !== 'n') {
        while (row1 !== row2 || col1 !== col2) {
          if(row1 < row2)
            row1++;
          else if (row1 > row2)
            row1--;
          if(col1 < col2)
            col1++;
          else if (col1 > col2)
            col1--;
          path.push([row1, col1]);
        }
      }
      else {
        path.push([row2, col2]);
      }

      return path;
    }
    window.addEventListener('mouseup', (e: any) => {
      if (movingPiece == null)
        return;
      
      let tilePos: number[] = getTileOnBoard(e, movingPiece);
      if (!legalMoves.find(move => move[0] === tilePos[0] - 1 && move[1] === 8 - tilePos[1])) {
        tilePos[0] = initialPos[0];
        tilePos[1] = initialPos[1];
      }

      let squareClass: string = [...movingPiece.classList].find(cl => cl.includes('square'));
      movingPiece.classList.remove(squareClass);

      board[initialPos[0] - 1][8 - initialPos[1]] = '';

      const pieces = document.querySelectorAll('.piece');
      let newSquareClass = `square-${tilePos[1]}${tilePos[0]}`;

      let pieceOnNewSquare = Array.from(pieces).find((p: Element) => Array.from(p.classList).includes(newSquareClass));
      if (pieceOnNewSquare)
        pieceOnNewSquare.className = 'element-pool';
      
      movingPiece.classList.add(newSquareClass);

      let pieceClass: string = [...movingPiece.classList].find(cl => cl.includes('w') || cl.includes('b'))!
      board[tilePos[0] - 1][8 - tilePos[1]] = pieceClass[0] === 'b' ? pieceClass[1] : pieceClass[1].toUpperCase();

      const squares = Array.from(document.querySelectorAll('.square'));
      let index = (8 - initialPos[0]) * 8 + initialPos[1] - 1;
      if (isFlipped.value) 
        index = 63 - index;

      squares[index].classList.remove('highlighted');

      let outlinedSquare = squares.find((el: Element) => Array.from(el.classList).includes('outlined'))
      if (outlinedSquare)
        outlinedSquare.classList.remove('outlined');

      let legalMovesSquares = squares.filter((el: Element) => Array.from(el.classList).includes('legal'))
      legalMovesSquares.forEach(sq => {
        sq.classList.remove('legal');
      });

      movingPiece.classList.remove('dragging');
      movingPiece.style.transform = '';
      document.removeEventListener('mousemove', movePiece);
      movingPiece = null;
      legalMoves = [];

      if (board[tilePos[0] - 1][8 - tilePos[1]].toLowerCase() === 'p') {
        if (isWhiteTurn && tilePos[0] - 1 === 7 || !isWhiteTurn && tilePos[0] - 1 === 0) {
          isPromotion = true;
          isModalVisible.value = true;
        }
      }
      if (!isPromotion && (tilePos[0] !== initialPos[0] || tilePos[1] !== initialPos[1]))
        finishMove(tilePos);
    });
    const finishMove = (tilePos: number[]) => {
      let piece = board[tilePos[0] - 1][8 - tilePos[1]];

        if (enPassant.isAvailable) {
          if (piece.toLowerCase() === 'p') {
            if (tilePos[0] - 1 === enPassant.captureSquare[0] && 8 - tilePos[1] === enPassant.captureSquare[1]) {
              board[enPassant.passingPawn[0]][enPassant.passingPawn[1]] = '';
            }
          }

          enPassant.isAvailable = false;
          enPassant.passingPawn = [];
          enPassant.captureSquare = [];
        }

        if (piece.toLowerCase() === 'k') {
          if (piece === piece.toLowerCase()) {
            blackCastling.BKSC = false;
            blackCastling.BQSC = false;

            if (tilePos[0] - 1 === 7 && 8 - tilePos[1] === 1) {
              board[7][0] = '';
              board[7][2] = 'r';
            }
            else if (tilePos[0] - 1 === 7 && 8 - tilePos[1] === 5) {
              board[7][7] = '';
              board[7][4] = 'r';
            }
          }
          else if (piece === piece.toUpperCase()) {
            whiteCastling.WKSC = false;
            whiteCastling.WQSC = false;

            if (tilePos[0] - 1 === 0 && 8 - tilePos[1] === 1) {
              board[0][0] = '';
              board[0][2] = 'R';
            }
            else if (tilePos[0] - 1 === 0 && 8 - tilePos[1] === 5) {
              board[0][7] = '';
              board[0][4] = 'R';
            }
          }
        }
        else if (piece.toLowerCase() === 'r') {
          if (piece === piece.toLowerCase()) {
            if (8 - initialPos[1] === 0)
              blackCastling.BKSC = false;
            else if (8 - initialPos[1] === 7)
              blackCastling.BQSC = false;
          }
          else if (piece === piece.toUpperCase()) {
            if (8 - initialPos[1] === 0)
              whiteCastling.WKSC = false;
            else if (8 - initialPos[1] === 7)
              whiteCastling.WQSC = false;
          }
        }
        else if (piece.toLowerCase() === 'p') {
          if (piece === piece.toUpperCase()) {
            if (initialPos[0] - 1 === 1 && tilePos[0] - 1 === 3) {
              if (8 - tilePos[1] + 1 < 8 && board[3][8 - tilePos[1] + 1] === 'p' || 8 - tilePos[1] - 1 >= 0 && board[3][8 - tilePos[1] - 1] === 'p') {
                enPassant.isAvailable = true;
                enPassant.passingPawn = [tilePos[0] - 1, 8 - tilePos[1]];
                enPassant.captureSquare = [tilePos[0] - 2, 8 - tilePos[1]];
              }
            }
          }
          else if (piece === piece.toLowerCase()) {
            if (initialPos[0] - 1 === 6 && tilePos[0] - 1 === 4) {
              if (8 - tilePos[1] + 1 < 8 && board[4][8 - tilePos[1] + 1] === 'P' || 8 - tilePos[1] - 1 >= 0 && board[4][8 - tilePos[1] - 1] === 'P') {
                enPassant.isAvailable = true;
                enPassant.passingPawn = [tilePos[0] - 1, 8 - tilePos[1]];
                enPassant.captureSquare = [tilePos[0], 8 - tilePos[1]];
              }
            }
          }
        }
 
        if (whiteCastling.WKSC && tilePos[0] - 1 === 0 && 8 - tilePos[1] === 0)
          whiteCastling.WKSC = false;
        if (whiteCastling.WQSC && tilePos[0] - 1 === 0 && 8 - tilePos[1] === 7)
          whiteCastling.WQSC = false;

        if (blackCastling.BKSC && tilePos[0] - 1 === 7 && 8 - tilePos[1] === 0)
          blackCastling.BKSC = false;
        if (blackCastling.BQSC && tilePos[0] - 1 === 7 && 8 - tilePos[1] === 7)
          blackCastling.BQSC = false;

        resetBoard();
        
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === (isWhiteTurn ? 'k' : 'K')) {
              if (isUnderAttack(i, j, !isWhiteTurn)) {
                isCheck = true;
                if (checkForMate(!isWhiteTurn)) {
                  emit('endGame', isWhiteTurn ? 1 : 0, isWhiteTurn ? 0 : 1);
                }
              }
            }
          }
        }

        if (!isCheck && checkForMate(!isWhiteTurn)) {
          emit('endGame', 1, 1);
        }

        isWhiteTurn = !isWhiteTurn;
        SocketioService.madeMove(props.gameData?._id, board, whiteCastling, blackCastling, enPassant, isCheck);
        sentMadeMove = true;

        initialPos = [];
    }
    const choosePromotionPiece = (pieceName: string) => {
      let pawnInd = board[0].findIndex(p => p === 'p');
      if (pawnInd !== -1) {
        board[0][pawnInd] = pieceName;
        finishMove([1, 8 - pawnInd]);
        isModalVisible.value = false;
        isPromotion = false;
      }
      else {
        pawnInd = board[7].findIndex(p => p === 'P');
        if (pawnInd !== -1) {
          board[7][pawnInd] = pieceName.toUpperCase();
          finishMove([8, 8 - pawnInd]);
          isModalVisible.value = false;
          isPromotion = false;
        }
      }
    }
    const closeModal = () => {
      isModalVisible.value = false;
      SocketioService.getGameData(props.gameData._id);
      isPromotion = false;
      initialPos = [];
    }
    const checkForMate = (isPieceWhite: boolean) => {
      let totalMoves = [];
      let moves;
      let enemyPieces: { name: string, row: number, col: number }[] = [];
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] !== '') {
            if ((isPieceWhite && board[i][j] === board[i][j].toUpperCase()) || (!isPieceWhite && board[i][j] === board[i][j].toLowerCase()))
              enemyPieces.push({
                name: board[i][j].toLowerCase(),
                row: i,
                col: j
              });
          }
        }
      }

      for(let piece of enemyPieces) {
        moves = findLegalMoves(piece.name, isPieceWhite, piece.row, piece.col, true);
        if (moves.length !== 0) 
          totalMoves.push(moves);
      }
      if (totalMoves.length === 0)
        return true;

      return false;
    }

    return {
      isModalVisible,
      startMoving,
      resetBoard,
      user,
      isFlipped,
      whiteTime,
      blackTime,
      gotData,
      choosePromotionPiece,
      closeModal
    }
  },
  components: {
    ModalPromotion
  }
}
</script>

<style>

</style>