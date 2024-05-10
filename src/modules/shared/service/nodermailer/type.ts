export type TSendMealParams = {
  to: string;
  // 标题
  subject: string;
  // 具体内容
  content: string;
  attachments: {
    filename: string;
    path: string;
  }[];
};

export type TSendVerificationParams = {
  to: string;
  code: string;
};
