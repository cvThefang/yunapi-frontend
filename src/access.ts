/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState: InitialState | undefined,
) {
  // 从全局状态中拿到登录的用户信息
  const {loginUser} = initialState ?? {};
  return {
    canUser: loginUser,
    canAdmin: loginUser && loginUser?.userRole === 'admin',
  };
}
