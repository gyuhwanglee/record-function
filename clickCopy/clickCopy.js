import { toast } from 'react-toastify';
const notify = () => {
  toast.success('Copied', {});
};
export const ClickCopy = text => {
  console.log('text', text);
  if (navigator.clipboard) {
    // (IE는 사용 못하고, 크롬은 66버전 이상일때 사용 가능)
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notify();
      })
      .catch(() => {
        alert('복사를 다시 시도해주세요.');
      });
  }
};
