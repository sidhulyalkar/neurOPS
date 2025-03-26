process ZScore {
  input:
    path raw_trace
  output:
    path 'zscored_trace.txt'

  script:
  '''
  python3 -c "import numpy as np; x=np.loadtxt('raw_trace.txt'); x=(x-x.mean())/x.std(); np.savetxt('zscored_trace.txt', x)"
  '''
}

process TrainModel {
  input:
    path zscored_trace
  output:
    path 'model_accuracy.txt',
    path 'model_precision.txt'

  script:
  '''
  python3 -c "import numpy as np; from sklearn.linear_model import LogisticRegression; \
  from sklearn.model_selection import train_test_split; from sklearn.metrics import accuracy_score, precision_score; \
  x=np.loadtxt('zscored_trace.txt').reshape(-1, 1); y=(x.flatten() > 0).astype(int); \
  x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2); \
  model=LogisticRegression().fit(x_train, y_train); y_pred=model.predict(x_test); \
  acc=accuracy_score(y_test, y_pred); prec=precision_score(y_test, y_pred); \
  open('model_accuracy.txt', 'w').write(f'{acc:.2f}'); open('model_precision.txt', 'w').write(f'{prec:.2f}')"
  '''
}

workflow {
  raw_trace = file('data/raw_trace.txt')
  z = ZScore(raw_trace)
  TrainModel(z)
}
