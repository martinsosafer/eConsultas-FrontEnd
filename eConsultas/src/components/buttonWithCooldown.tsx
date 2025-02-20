import { useEffect, useState } from "react";
import Button from "./button";
import { ButtonProps } from "./ui/button";

interface ButtonWithCooldownProps extends Omit<ButtonProps, 'type'> {
  cooldownDuration?: number;
  label: string;
  type?: "custom" | "secondary" | "primary" | "accent" | "secondary-accent" | "danger"; 
}

export default function ButtonWithCooldown({
  label,
  type = "primary",
  onClick,
  cooldownDuration = 5,
  disabled = false,
  ...props
}: ButtonWithCooldownProps) {
  const [cooldown, setCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(cooldownDuration);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (cooldown) {
      interval = setInterval(() => {
        setRemainingTime((prev: number) => {
          if (prev <= 1) {
            setCooldown(false);
            return cooldownDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [cooldown, cooldownDuration]);

  const handleClick = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!cooldown && !disabled && onClick) {
      onClick(e);
      setCooldown(true);
      setRemainingTime(cooldownDuration);
    }
  };

  const buttonLabel = cooldown 
    ? `Espere ${remainingTime}s` 
    : label;

  return (
    <Button
      {...props}
      label={buttonLabel}
      type={type}
      onClick={handleClick}
      disabled={disabled || cooldown}
    />
  );
}