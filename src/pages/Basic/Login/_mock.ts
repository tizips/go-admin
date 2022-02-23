import type { Request, Response } from 'express';

export default {
  'POST /api/login/account': async (req: Request, res: Response) => {
    const { password, username } = req.body;
    if (password === 'tizips' && username === 'tizips') {
      res.send({
        status: 20000,
        message: 'Success',
      });
      return;
    }

    res.send({
      status: 40100,
      message: '用户名或密码错误！',
    });
  },
};