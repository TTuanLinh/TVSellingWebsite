import bcrypt from 'bcrypt';

async function hashMyPassword() {
  // 10 là "salt rounds" (số vòng băm) - con số tiêu chuẩn
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  console.log('Mật khẩu đã mã hóa của bạn là:');
  console.log(hashedPassword);
}

hashMyPassword();