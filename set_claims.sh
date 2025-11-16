#!/bin/bash

# This script will set the custom claim is_host=true for the specified users.
# Ensure you are logged into gcloud with the correct project.

gcloud identity users update nwWfyBD3WlVNV2xWICM5aDhY1on1 --project=studio-3998158591-ecbfd --update-custom-attributes='{"is_host":true}'