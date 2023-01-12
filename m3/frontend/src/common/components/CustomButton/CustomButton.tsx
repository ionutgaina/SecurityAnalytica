import './CustomButton.css';

interface IButtonProps {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  type: 'button' | 'submit' | 'reset' | undefined;
}

export default function CustomButton({ text, onClick, type }: IButtonProps) {
  return (
    <button onClick={onClick} className={`mybutton px-2`} type={type ? type : 'button'}>
      <p className={`h5 text`}>{text}</p>
    </button>
  );
}