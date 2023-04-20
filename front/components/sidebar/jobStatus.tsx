/**
 * The external imports
 */
import { useEffect, useState } from "react";
import { Stack, Progress } from '@chakra-ui/react'
import type { Cable } from "actioncable";


const JobStatus = () => {
  const [status, setStatus] = useState<number>(0)
  const [code, setCode] = useState<string>("")
  const actionCable: { cable?: Cable } = {} 

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(actionCable).length === 0) {
      // Had to import the library this way cause in needs to be called only in the client part
      const { createConsumer } = require('@rails/actioncable');
      
      actionCable.cable = createConsumer(`${process.env.NEXT_PUBLIC_API_WS_URL}`);
      if (actionCable.cable) {
        actionCable.cable.subscriptions.create(
          {
            channel: "JobStatusChannel",
            id: 1,
          },
          {
            received: (data: { status: number, code: string }) => {
              setStatus(data.status)
              setCode(data.code)
            }, 
          }
        );
      } 
    }  
  }, []);

  return (
    <>
    {/* TODO change the whole code for json generation */}
      {code.toString()}
      <Stack spacing={5} w={190}>
        <Progress colorScheme='green' size='lg' value={status} />
      </Stack>
    </>
  );
};

export default JobStatus;