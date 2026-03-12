import pandas as pd
from sdv.single_table import GaussianCopulaSynthesizer
from sdv.metadata import Metadata

data = pd.read_csv("seed_data.csv")

metadata = Metadata.detect_from_dataframe(data)

synthesizer = GaussianCopulaSynthesizer(metadata)

synthesizer.fit(data)

synthetic_data = synthesizer.sample(5000)

synthetic_data.to_csv("synthetic_patients.csv", index=False)

print("Dataset generated!")
