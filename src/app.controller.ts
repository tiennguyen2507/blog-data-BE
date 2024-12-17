import { Controller, Get } from '@nestjs/common';
import { pathToRegexp } from 'path-to-regexp';

@Controller()
export class AppController {
  @Get('/hello')
  hello() {
    const apiList = [
      {
        methods: 'GET',
        url: '/mail/:id',
        response: {
          status: 200,
          message: 'success',
        },
      },
      {
        methods: 'GET',
        url: '/mail/123',
        response: {
          status: 200,
          message: 'success',
        },
      },
      {
        methods: 'GET',
        url: '/mail/:name/:dsadasd',
        response: {
          status: 200,
          message: 'success',
        },
      },
      {
        methods: 'POST',
        url: '/chat/:helle',
        response: {
          status: 200,
          message: 'success',
        },
      },
    ];

    const url = '/mail/12312/ádasdsa';

    const getMatchingUrl = () => {
      const matchingUrls = []; // Danh sách để lưu trữ các URL khớp
      for (const api of apiList) {
        const { regexp } = pathToRegexp(api.url);
        if (regexp.test(url)) {
          matchingUrls.push(api.url); // Thêm URL pattern khớp vào danh sách
        }
      }

      // New logic to find the URL with the fewest parameters
      const urlWithFewestParams = matchingUrls.reduce((prev, curr) => {
        return (curr.match(/:/g) || []).length < (prev.match(/:/g) || []).length
          ? curr
          : prev;
      }, matchingUrls[0]);

      console.log(urlWithFewestParams); // Log the URL with the fewest parameters
      return urlWithFewestParams; // Trả về URL với số lượng tham số ít nhất
    };
    console.log(getMatchingUrl());
    return getMatchingUrl();
  }
}
