import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import React from 'react';
import {
  Platform,
  Pressable,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

function PasswordInput({
  className,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  const [visible, setVisible] = React.useState(false);

  return (
    <View className='relative flex-row items-center'>
      <TextInput
        className={cn(
          'dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
          props.editable === false &&
            cn(
              'opacity-50',
              Platform.select({
                web: 'disabled:pointer-events-none disabled:cursor-not-allowed',
              })
            ),
          Platform.select({
            web: cn(
              'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
            ),
            native: 'placeholder:text-muted-foreground/50',
          }),
          className
        )}
        returnKeyType='done'
        aria-labelledby='password'
        secureTextEntry={!visible}
        {...props}
      />

      <View className='absolute right-3'>
        <Pressable
          onPress={() => setVisible(!visible)}
          accessible={true}
          accessibilityLabel={
            visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
          }
        >
          {visible ? (
            <EyeOff size={20} color='#6B7280' />
          ) : (
            <Eye size={20} color='#6B7280' />
          )}
        </Pressable>
      </View>
    </View>
  );
}

export { PasswordInput };
