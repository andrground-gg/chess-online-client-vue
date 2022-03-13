import { server } from '@/helper';

export default {
  async getUser(context: any, payload: string) {
    const response = await fetch(`${server.baseURL}/users/${payload}`);
    const data = await response.json();
    
    if (!data)
      return;
    
    context.commit('setUser', data);
  },
  async getActiveGame(context: any, payload: string): Promise<boolean> {
    const response = await fetch(`${server.baseURL}/games/${payload}`);
    const data = await response.json();
    
    if (!data || data.statusCode === 500)
      return false;
    
    context.commit('setActiveGame', data);
    return true;
  }
}