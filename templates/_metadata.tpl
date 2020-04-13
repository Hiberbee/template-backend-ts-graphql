{{- define "metadata.name" }} {{/*@formatter:off*/}}
  {{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | snakecase | replace "_" "-" | trunc 63 | lower | trimSuffix "-" -}}
  {{- else -}}
{{- $name :=  default .Chart.Name .Release.Name .Values.nameOverride -}}
    {{- if contains $name .Release.Name -}}
{{- .Release.Name | snakecase | replace "_" "-"  | trunc 63 | lower | trimSuffix "-" -}}
    {{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
    {{- end -}}
  {{- end -}}
{{ end -}} {{/*@formatter:on*/}}

{{- define "metadata.labels" }}
app.kubernetes.io/name: {{ include "metadata.name" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/version: {{ .Chart.Version | quote }}
app.kubernetes.io/instance: {{ .Release.Name | lower }}
{{ end -}}

{{- define "pod.labels" }}
app.kubernetes.io/instance: {{ .Release.Name | lower }}
{{ end -}}
