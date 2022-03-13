export default {
  setUser(state: any, payload: any): void {
    state.user = payload;
  },
  unsetData(state: any): void {
    state.user = null;
    state.activeGame = null;
  },
  setActiveGame(state: any, payload: any) {
    state.activeGame = payload;
  },
  unsetActiveGame(state: any) {
    state.activeGame = null;
  },
  addToChat(state: any, payload: any) {
    state.activeGame.chat.push(payload);
  }
}