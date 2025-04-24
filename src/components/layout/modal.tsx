import { Button, ButtonState } from "@components/home/button";
import { DEFAULT_WALLET } from "@utils/globals";
import React, { useState, useEffect } from "react";
import { useSound } from "@components/common/sound-manager";
import { toast } from "react-hot-toast";

type Props = {
  onClick: Function;
  butttonState: ButtonState;
  headerContent: string;
  buttonContent: string;
  isToken?: boolean;
  id: string;
};

export function Modal({
  onClick,
  butttonState,
  headerContent,
  buttonContent,
  isToken = false,
  id,
}: Props) {
  const [address, setAddress] = useState<string>(DEFAULT_WALLET);
  const [amount, setAmount] = useState<string>("1");
  const [isValid, setIsValid] = useState<boolean>(false);
  const { playSound } = useSound();

  // Validate form inputs
  useEffect(() => {
    const isAddressValid = address && address.trim().length > 0;
    const isAmountValid = amount && !isNaN(Number(amount)) && Number(amount) > 0;
    setIsValid(isAddressValid && isAmountValid);
  }, [address, amount]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      playSound('error');
      toast.error('Please enter valid wallet address and amount');
      return;
    }

    playSound('click');

    // Call the onClick function with the form data
    onClick({
      isToken,
      address,
      amount: Number(amount),
    })();

    // Close the modal after submission
    const modalCheckbox = document.getElementById(id) as HTMLInputElement;
    if (modalCheckbox) {
      modalCheckbox.checked = false;
    }
  };

  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <label htmlFor={id} className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <form onSubmit={handleSubmit}>
            <h3 className="font-bold text-xl mb-4">{headerContent}</h3>
            <label htmlFor={id} className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => playSound('click')}>✕</label>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">Wallet Address</span>
              </label>
              <input
                type="text"
                value={address}
                placeholder={DEFAULT_WALLET}
                className="input input-bordered w-full focus:ring-2 focus:ring-goldium-400 transition-all"
                onChange={(ev) => setAddress(ev.currentTarget.value)}
                required
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">Enter the recipient's wallet address</span>
              </label>
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">Amount</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  min="0.000001"
                  step="0.000001"
                  placeholder="1"
                  className="input input-bordered w-full pr-16 focus:ring-2 focus:ring-goldium-400 transition-all"
                  onChange={(ev) => setAmount(ev.currentTarget.value)}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  {isToken ? "GOLD" : "SOL"}
                </span>
              </div>
              <label className="label">
                <span className="label-text-alt text-gray-500">Enter the amount to send</span>
              </label>
            </div>

            <div className="modal-action">
              <label htmlFor={id} className="btn btn-outline" onClick={() => playSound('click')}>
                Cancel
              </label>
              <button
                type="submit"
                className={`btn ${isToken ? 'btn-goldium' : 'btn-primary'} ${!isValid ? 'btn-disabled' : ''} ${butttonState === 'loading' ? 'loading' : ''}`}
                disabled={!isValid || butttonState === 'loading'}
              >
                {butttonState === 'loading' ? 'Processing...' : buttonContent}
              </button>
            </div>
          </form>
        </label>
      </label>
    </>
  );
}
