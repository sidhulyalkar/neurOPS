process GenerateData {
  conda 'workflow/snakemake/envs/numpy.yaml'
  output:
    path 'data/raw_trace.txt'

  script:
  '''
  python -c \"import numpy as np; np.savetxt('data/raw_trace.txt', np.random.randn(100))\"
  '''
}

process ZScore {
  conda 'workflow/snakemake/envs/numpy.yaml'
  input:
    path raw_trace
  output:
    path 'results/zscored_trace.txt'

  script:
  '''
  python -c \"import numpy as np; x=np.loadtxt('data/raw_trace.txt'); x=(x-x.mean())/x.std(); np.savetxt('results/zscored_trace.txt', x)\"
  '''
}

process TrainModel {
  conda 'workflow/snakemake/envs/sklearn.yaml'
  input:
    path zscored_trace
  output:
    path 'results/model_accuracy.txt'
    path 'results/model_precision.txt'

  script:
  '''
  python -c \"import numpy as np; from sklearn.linear_model import LogisticRegression; \\
  from sklearn.model_selection import train_test_split; from sklearn.metrics import accuracy_score, precision_score; \\
  x=np.loadtxt('results/zscored_trace.txt').reshape(-1, 1); y=(x.flatten() > 0).astype(int); \\
  x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2); \\
  model=LogisticRegression().fit(x_train, y_train); y_pred=model.predict(x_test); \\
  acc=accuracy_score(y_test, y_pred); prec=precision_score(y_test, y_pred); \\
  open('results/model_accuracy.txt', 'w').write(f'{acc:.2f}'); open('results/model_precision.txt', 'w').write(f'{prec:.2f}')\"
  '''
}

workflow {
  raw = GenerateData()
  z = ZScore(raw)
  TrainModel(z)
}