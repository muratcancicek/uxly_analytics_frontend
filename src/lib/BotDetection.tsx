import TransactionHistoryHandler from './ClassModels/TransactionHistoryHandler';
import * as tf from '@tensorflow/tfjs';

async function loadModel() {
    const model = await tf.loadGraphModel('http://localhost:3000/TensorflowModels/BotDetectionModel/model.json');
    return model;
}

export async function detectBot(
  address: string, 
  transactions: any[],
): Promise<boolean> {
  const handler = new TransactionHistoryHandler(address, transactions);
  const historyVector = handler.getHistoryVectorized();
  console.log("History Vector: ", historyVector.length);
  try {
    const model = await loadModel();
    const hisTensor = tf.tensor(historyVector).reshape([1, -1]) as tf.Tensor;
    const prediction = model.predict(hisTensor) as tf.Tensor;
    return prediction.dataSync()[0] > 0.5;
  } catch (error) {
    console.log("Error: ", error);
    return false;
  }
}
