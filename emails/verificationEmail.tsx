import {  Html,Head,Preview,Heading,Row,Font ,Section,Text,Button } from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return  (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Email</title>
        <Font fontFamily="Roboto" fallbackFontFamily="Verdana" webFont={{url:'https://font.gstatic.com/s/roboto/v27/KF0mCnqEu92Fr1Mu4mxKKTU1Kg.woff2',format:'woff2'}}
        fontWeight={400} 
        fontStyle="normal"
         />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>

      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering on our platform. Please use the following One-Time Password (OTP) to verify your registeration:
          </Text>

        </Row>
        <Row>
          <Text>{otp}</Text>
          </Row>
          <Row>
            <Text>
              If you did not request this, please ignore this email.

            </Text>
          </Row>
          {/* <Row> <Button href=`https://localhost:3000/verify/${username}`style={{backgroundColor:'#007bff',color:'#ffffff',padding:'10px 20px',textDecoration:'none',borderRadius:'5px'}}>Verify Email</Button></Row> */}
      </Section>
      </Html>
  );
}