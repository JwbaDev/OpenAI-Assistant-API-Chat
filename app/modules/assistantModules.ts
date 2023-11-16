// Type: Module
// assistantModules.ts
import { convertFileToBase64 } from '../utils/convertFileToBase64';
import {
  uploadImageAndGetDescription,
  uploadFile,
  createAssistant,
  createThread,
  runAssistant,
} from '../services/api';

interface AssistantDetails {
  assistantName: string;
  assistantModel: string;
  assistantDescription: string;
}

interface UploadedFileResponse {
  fileId: string;
}

interface AssistantDataResponse {
  assistantId: string;
}

interface ThreadDataResponse {
  threadId: string;
}


/**
* Prepares and uploads a file for the chat assistant.
* This can include converting images to base64, handling different file types, etc.
* @param {File} file - The file to be uploaded.
* @returns {Promise<string>} - The ID of the uploaded file.
*/
export const prepareUploadFile = async (file: File): Promise<string> => {
  console.log('Preparing file for upload...');

  // If the file is an image, get a description from GPT-4 Vision API
  if (file.type.startsWith('image/')) {
    console.log('File is an image, getting description...');
    const base64Image = await convertFileToBase64(file);
    const descriptionResponse = await uploadImageAndGetDescription(base64Image);
    console.log('Image description:', descriptionResponse.analysis);

    // Create a Blob from the description
    const descriptionBlob = new Blob([descriptionResponse.analysis], { type: 'text/plain' });

    // Create a File object from the Blob
    const descriptionFile = new File([descriptionBlob], 'description.txt');

    // Upload the description file
    const uploadedFile: UploadedFileResponse = await uploadFile(descriptionFile);
    console.log('Description file uploaded successfully. File ID:', uploadedFile.fileId);
    return uploadedFile.fileId;
  }

  // If the file is not an image, upload it as a normal file
  const uploadedFile: UploadedFileResponse = await uploadFile(file);
  console.log('File uploaded successfully. File ID:', uploadedFile.fileId);
  return uploadedFile.fileId;
};



/**
* Initializes a chat assistant with the given details.
* @param {Object} assistantDetails - Details of the assistant to be created.
* @param {string} fileId - The ID of the uploaded file associated with the assistant.
* @returns {Promise<string>} - The ID of the created assistant.
*/
export const initializeAssistant = async (assistantDetails: AssistantDetails, fileId: string): Promise<string> => {
  console.log('Initializing assistant...');
  const assistantData: AssistantDataResponse = await createAssistant(
      assistantDetails.assistantName,
      assistantDetails.assistantModel,
      assistantDetails.assistantDescription,
      fileId
  );
  console.log('Assistant created successfully. Assistant ID:', assistantData.assistantId);
  return assistantData.assistantId; 
};



/**
* Creates a chat thread with the initial message.
* @param {string} inputMessage - The initial message for the thread.
* @returns {Promise<string>} - The ID of the created thread.
*/
export const createChatThread = async (inputMessage: string): Promise<string> => {
  console.log('Creating chat thread...');
  const threadData: ThreadDataResponse = await createThread(inputMessage);
  console.log('Chat thread created successfully. Thread ID:', threadData.threadId);
  return threadData.threadId;
};




/**
* Runs the chat assistant for a given thread.
* @param {string} assistantId - The ID of the assistant.
* @param {string} threadId - The ID of the thread.
* @returns {Promise<void>} - A promise that resolves when the assistant is successfully run.
*/
export const runChatAssistant = async (assistantId: string, threadId: string): Promise<string | null> => {
  
  console.log('Running chat assistant...');

  const response = await runAssistant(assistantId, threadId);
  const runId = response.runId;

  console.log('Chat assistant run successfully. Run ID:', runId);
  return runId; 
};