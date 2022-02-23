import { Request, Response } from 'express';

export default {
  'GET /api/account': (req: Request, res: Response) => {
    if (false) {
      res.status(401)
        .send({
          data: null,
          status: 40100,
          message: '请先登录！',
        });
      return;
    }
    res.send({
      status: 20000,
      message: 'Success',
      data: {
        username: 'tizips',
        nickname: '拿个橙子榨橙汁',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        mobile: '13003630210',
      },
    });
  },
  'POST /api/logout': (req: Request, res: Response) => {
    res.send({ status: 20000, message: 'Success', data: null });
  },
  'GET /api/permission': (req: Request, res: Response) => {
    res.send({
      status: 20000, message: 'Success', data: [],
    });
  },
};