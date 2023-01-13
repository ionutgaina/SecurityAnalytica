import './CustomButton.css';

interface IButtonProps {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  type?: 'button' | 'submit' | 'reset';
}

export default function CustomButton({ text, onClick, type }: IButtonProps) {
  return (
    <button onClick={onClick} className={`mybutton px-2`} type={type ? type : 'button'}>
      <p className={`h6 text pt-2`}>{text}</p>
    </button>
  );
}