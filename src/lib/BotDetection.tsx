import TransactionHistoryHandler from './ClassModels/TransactionHistoryHandler';
import * as tf from '@tensorflow/tfjs';

async function loadModel() : Promise<tf.GraphModel> {
  const model = await tf.loadGraphModel('http://localhost:3000/TensorflowModels/BotDetectionModel/model.json');
  return model;
}

async function scale(hisTensor: tf.Tensor) : Promise<tf.Tensor> {
    // Fetch the JSON file
    const response = await fetch('/TensorflowModels/BotDetectionModel/scaler.json');
    const scaler = await response.json();
    const mean = tf.tensor(scaler.mean);
    const std = tf.tensor(scaler.std);
    const scaled = hisTensor.sub(mean).div(std);
  return scaled;
}

export async function  estimateBotPossibility(
  address: string, 
  transactions: any[],
): Promise<number> {
  try {
    const handler = new TransactionHistoryHandler(address, transactions);
    const historyVector = handler.getHistoryVectorized();
    console.log("History Vector: ", historyVector.length);
    const model = await loadModel();
    const hisTensor = tf.tensor(historyVector).reshape([1, -1]) as tf.Tensor;
    const scaledHisTensor = await scale(hisTensor);
    const pred = model.predict(scaledHisTensor) as tf.Tensor;
    const prediction = pred.dataSync()[0] * 100;
    return prediction;
  } catch (error) {
    console.log("Error: ", error);
    return 0;
  }
}
