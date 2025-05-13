# CDK Lambda layer
_Date: 2024-04-10 18:35:21_

Dir structure

app.py  
cdk  
- stack.py  
service  
- lambdas  
 - my\_request\_handler  
 - index.py, containing "handler"  
 - requirements.txt  
 - utils  
 - requirements.txt  
tests

```
powertools_layer = PythonLayerVersion.lambda_powertools(
            stack=self,
            config=config,
        )

utils_layer = PythonLayerVersion(
            stack=self,
            config=config,
            entry=os.path.join(source_dir, "lambdas", "utils"),
        )


```

Constructs

```
import os
from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
    BundlingOptions,
    RemovalPolicy,
)
from typing import Optional
from bw_cdk.config_base import ConfigBase


class PythonLayerVersion(_lambda.LayerVersion):

    def __init__(
        self,
        stack: Stack,
        config: ConfigBase,
        entry: str,
        id: Optional[str] = None,
        description: Optional[str] = None,
        runtime: Optional[_lambda.Runtime] = _lambda.Runtime.PYTHON_3_11,
        architecture: Optional[_lambda.Runtime] = _lambda.Architecture.ARM_64,
        **kwargs,
    ):
        """Creates a lamdba layer, including packaging from requirements.txt, for shared code in the stack.

        Args:
            stack [Stack]: CDK stack
            config [ConfigBase]: configuration object
            entry [str]: full path to the lambda layer directory e.g. "/service/utils"
            id [Optional[str]]: name to give the lambda layer in the stack
            description [Optional[str]]: short description of the lambda layer
            runtime [Optional[aws_cdk.aws_lambda.Runtime]]: lambda runtime, default is python 3.11
            architecture [Optional[aws_cdk.aws_lambda.Architecture]]: lambda architecture, default is ARM_64
            **kwargs: any other kwargs to pass down to cdk construct (see https://github.com/aws/aws-cdk/tree/main/packages/aws-cdk-lib/aws-lambda)
        """
        module_name = os.path.split(entry)[-1]

        if id is None:
            id = f"{config.stack_name}-{module_name.replace('_', '-')}-lambda-layer"

        if description is None:
            description = f"{module_name} lambda layer for stack '{config.stack_name}'"

        super().__init__(
            stack,
            id=id,
            description=description,
            layer_version_name=f"{config.stack_name}-{module_name.replace('_', '-')}-{architecture.to_string()}",
            removal_policy=RemovalPolicy.DESTROY,
            code=_lambda.Code.from_asset(
                entry,
                bundling=BundlingOptions(
                    image=runtime.bundling_image,
                    command=[
                        "bash",
                        "-c",
                        f"pip install -r requirements.txt -t /asset-output/python && cp -au . /asset-output/python/{module_name}",
                    ],
                ),
            ),
            compatible_runtimes=[runtime],
            compatible_architectures=[architecture],
            **kwargs,
        )

    @staticmethod
    def lambda_powertools(
        stack: Stack,
        config: ConfigBase,
        architecture: _lambda.Architecture = _lambda.Architecture.ARM_64,
        layer_version: int = 67,
    ) -> _lambda.LayerVersion:
        """Returns the public AWS Lambda Powertools layer."""
        arch_suffix = (
            "-Arm64"
            if architecture.to_string() == _lambda.Architecture.ARM_64.to_string()
            else ""
        )
        arn = f"arn:aws:lambda:{config.aws_region}:017000801446:layer:AWSLambdaPowertoolsPythonV2{arch_suffix}:{layer_version}"
        return _lambda.LayerVersion.from_layer_version_arn(
            stack,
            id="lambda-powertools-lambda-layer",
            layer_version_arn=arn,
        )
```

```
from aws_cdk import (
    Stack,
    aws_iam as iam,
    aws_lambda as _lambda,
    Duration,
    BundlingOptions,
)
from aws_cdk.aws_ec2 import (
    Vpc,
    Subnet,
    SecurityGroup,
)
import os
from typing import Optional, List
from bw_cdk.config_base import ConfigBase


class PythonFunction(_lambda.Function):

    def __init__(
        self,
        stack: Stack,
        config: ConfigBase,
        entry: str,
        handler: str,
        function_name: Optional[str] = None,
        id: Optional[str] = None,
        description: Optional[str] = None,
        vpc: Optional[Vpc] = None,
        vpc_subnets: Optional[List[Subnet]] = None,
        security_groups: Optional[List[SecurityGroup]] = None,
        role: Optional[iam.IRole] = None,
        events: Optional[List[_lambda.IEventSource]] = None,
        layers: Optional[List[_lambda.ILayerVersion]] = None,
        runtime: Optional[_lambda.Runtime] = _lambda.Runtime.PYTHON_3_11,
        architecture: Optional[_lambda.Architecture] = _lambda.Architecture.ARM_64,
        **kwargs,
    ):
        """Creates a *python 3.11* ARM64 lamdba function, including packaging from requirements.txt, with sensible defaults.

        Args:
            stack [Stack]: CDK stack
            config [ConfigBase]: configuration object
            entry [str]: full path to the lambda function directory e.g. "/service/lamdbas/my_function"
            handler [str]: name of the handler function e.g. index.handler, where `index.py` has a function `handler`
            function_name [Optional[str]]: name of the lambda function
            id [Optional[str]]: name to give the lambda function in the stack
            description [Optional[str]]: short description of the lambda function
            role [Optional[iam.IRole]]: IAM role for the lambda function
            vpc [Optional[Vpc]]: Id of VPC to connect lambda to
            vpc_subnets [Optional[List[Subnet]]: when configured with VPC, the subnets to use
            security_groups [Optional[List[SecurityGroup]]: optional list of security groups for lambda
            events [Optional[List[_lambda.IEventSource]]]: list of event sources to trigger the lambda function
            layers [Optional[List[_lambda.ILayerVersion]]]: list of lambda layers to include in the function, e.g. utils, power tools
            runtime [Optional[_lambda.Runtime]]: lambda runtime, default is python 3.11
            architecture [Optional[_lambda.Architecture]]: lambda architecture, default is ARM64
            **kwargs: any other kwargs to pass down to cdk construct (see https://github.com/aws/aws-cdk/tree/main/packages/aws-cdk-lib/aws-lambda)
        """
        if id is None:
            id = f"{config.stack_name}-lambda-function"
        if function_name is None:
            function_name = (
                f"{config.stack_name}-{os.path.split(entry)[-1].replace('_', '-')}"
            )
        super().__init__(
            stack,
            id=id,
            function_name=function_name,
            description=description,
            runtime=runtime,
            architecture=architecture,
            code=_lambda.Code.from_asset(
                path=entry,
                bundling=BundlingOptions(
                    image=runtime.bundling_image,
                    command=[
                        "bash",
                        "-c",
                        "pip install -r requirements.txt -t /asset-output && cp -au . /asset-output",
                    ],
                ),
            ),
            handler=handler,
            role=role,
            vpc=vpc,
            vpc_subnets=vpc_subnets,
            security_groups=security_groups,
            memory_size=kwargs.pop("memory_size", 1024),
            timeout=kwargs.pop("timeout", Duration.minutes(5)),
            logging_format=_lambda.LoggingFormat.JSON,
            system_log_level=_lambda.SystemLogLevel.INFO.value,
            application_log_level=_lambda.ApplicationLogLevel.INFO.value,
            insights_version=_lambda.LambdaInsightsVersion.VERSION_1_0_229_0,
            tracing=_lambda.Tracing.ACTIVE,
            events=events,
            environment={
                **kwargs.pop("environment", {}),
                "POWERTOOLS_METRICS_NAMESPACE": config.service,
                "POWERTOOLS_SERVICE_NAME": config.stack_name,
                "POWERTOOLS_DEV": str(config.is_dev),
            },
            layers=layers,
            **kwargs,
        )

        if vpc is not None:
            self.role.add_managed_policy(
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaVPCAccessExecutionRole"
                )
            )

            self.add_to_role_policy(
                iam.PolicyStatement(
                    actions=[
                        "ec2:AssignPrivateIpAddresses",
                        "ec2:CreateNetworkInterface",
                        "ec2:DeleteNetworkInterface",
                        "ec2:DescribeNetworkInterfaces",
                        "ec2:UnassignPrivateIpAddresses",
                    ],
                    resources=[
                        "*"
                    ],  # aws examples have all, but we might want to narrow to current vpc arn
                )
            )


# TODO cloudwatch alert if lamdba times out?
# if (fn.timeout) {
#     new cloudwatch.Alarm(this, `MyAlarm`, {
#         metric: fn.metricDuration().with({
#             statistic: 'Maximum',
#         }),
#         evaluationPeriods: 1,
#         datapointsToAlarm: 1,
#         threshold: fn.timeout.toMilliseconds(),
#         treatMissingData: cloudwatch.TreatMissingData.IGNORE,
#         alarmName: 'My Lambda Timeout',
#     });
# }

```

```
from aws_cdk import (
    Stack,
    aws_iam as iam,
)
from typing import Optional, List
from bw_cdk.config_base import ConfigBase


class LambdaRole(iam.Role):
    def __init__(
        self,
        scope: Stack,
        config: ConfigBase,
        role_id: Optional[str] = None,
        role_name: Optional[str] = None,
        s3_bucket_arns: Optional[List[str]] = None,
        secret_arns: Optional[List[str]] = None,
    ):

        if role_id is None:
            role_id = f"{config.stack_name}-lambda-role"

        if role_name is None:
            role_name = f"{config.stack_name}-lambda-role"

        super().__init__(
            scope,
            role_id,
            role_name=role_name,
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaBasicExecutionRole"
                ),
                # TODO - ezra; we _might_ want to make this an optional policy grant, gated on a vpc_arn param
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaVPCAccessExecutionRole"
                ),
            ],
        )

        if s3_bucket_arns:
            s3_bucket_arns = set(s3_bucket_arns)
            for bucket_arn in s3_bucket_arns.copy():
                if not bucket_arn.endswith("/*"):
                    s3_bucket_arns.add(f"{bucket_arn}/*")
            s3_bucket_arns = list(s3_bucket_arns)
            s3_policy = iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=["s3:Create*", "s3:Put*", "s3:Get*", "s3:Delete*"],
                resources=s3_bucket_arns,
            )
            self.add_to_policy(s3_policy)

        if secret_arns:
            secrets_policy = iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=["secretsmanager:Get*", "secretsmanager:Describe*"],
                resources=secret_arns,
            )
            self.add_to_policy(secrets_policy)


    def grant_kinesis_stream(self, stream_arn: str):
        self.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name(
                "service-role/AWSLambdaKinesisExecutionRole"
            )
        )
        self.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "kinesis:DescribeStream",
                    "kinesis:DescribeStreamSummary",
                    "kinesis:GetRecords",
                    "kinesis:GetShardIterator",
                    "kinesis:ListShards",
                    "kinesis:ListStreams",
                    "kinesis:SubscribeToShard",
                ],
                resources=[stream_arn],
            )
        )

```

The index.py

```
import os
from http import HTTPStatus
from logging import traceback
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.data_classes import (
    event_source,
    KinesisStreamEvent,
)


try:
    from .model import KinesisStreamPtlSchoolSignupRecord
    from .config import Config

    from service.lambdas.utils.hubspot.hubspot_client import HubspotClient
    from service.lambdas.utils.hubspot.model import *
    from service.lambdas.utils.postgres.postgres_client import PostgresClient
    from service.lambdas.utils.s3.s3_client import S3Client
    from service.lambdas.utils.slack.slack_client import SlackClient
    from service.lambdas.utils.mixpanel.mixpanel_client import MixpanelClient
    from service.lambdas.utils.mixpanel.model import MixpanelAttributionData
except:
    # no relative imports from top level when deployed to lamdba
    from model import KinesisStreamPtlSchoolSignupRecord
    from config import Config

    # no 'service.lambdas' when deployed to lamdba
    from utils.hubspot.hubspot_client import HubspotClient  # type: ignore
    from utils.hubspot.model import *  # type: ignore
    from utils.postgres.postgres_client import PostgresClient  # type: ignore
    from utils.s3.s3_client import S3Client  # type: ignore
    from utils.slack.slack_client import SlackClient  # type: ignore
    from utils.mixpanel.mixpanel_client import MixpanelClient  # type: ignore
    from utils.mixpanel.model import MixpanelAttributionData  # type: ignore


logger = Logger()
tracer = Tracer()
config = Config()

s3_client: S3Client = None
pg_client: PostgresClient = None
mixpanel_client: MixpanelClient = None
hubspot_client: HubspotClient = None
slack_client: SlackClient = None


@logger.inject_lambda_context
@tracer.capture_lambda_handler
@event_source(data_class=KinesisStreamEvent)
def handler(event: KinesisStreamEvent, context: LambdaContext) -> dict:
    """Handle kinesis stream event for PTL school signup workflow to hubspot form fill.

    Returns:
        dict: of `statusCode` and `body`
    """
    logger.info(f"Received kinesis stream event: {event}, context: {context}")

    global s3_client
    s3_client = s3_client or S3Client(config.S3_BUCKET)

    global pg_client
    pg_client = pg_client or PostgresClient(config.DB_CONN_SECRET_NAME)

    global mixpanel_client
    mixpanel_client = mixpanel_client or MixpanelClient(
        config.MIXPANEL_AUTH_SECRET_NAME
    )

    global hubspot_client
    hubspot_client = hubspot_client or HubspotClient(config.HS_AUTH_SECRET_NAME)

    global slack_client
    slack_client = slack_client or SlackClient(config.SLACK_WEBHOOK_SECRET_NAME)

    # Parse records, and drop dupes by event_id
    unique_payloads = []
    event_ids = None
    try:
        event_ids = ",".join([x.get("eventID", "?") for x in event.get("Records", [])])
        used = set()
        for x in event.records:
            if x.event_id in used:
                logger.warning(f"Duplicate payloads detected: {x.event_id}!")
                continue
            unique_payloads.append(KinesisStreamPtlSchoolSignupRecord(x))
            used.add(x.event_id)
    except Exception as ex:
        slack_client.send(
            f"Failed '{context.function_name}' lambda for {event_ids}.\n\nUnable to parse payload.\n{ex}"
        )

    failures = []
    for payload in unique_payloads:
        try:
            __process_record(
                payload=payload,
                context=context,
                slack_client=slack_client,
            )
        except Exception as ex:
            failures.append(ex)

    if failures:
        error_msgs = "\n  - ".join([str(x) for x in failures])
        slack_client.send(
            f"Failed '{context.function_name}' lambda for {event_ids=}. Errors:\n  - {error_msgs}"
        )
        raise ExceptionGroup(
            f"Error(s) found during '{context.function_name}' lambda execution.",
            failures,
        )

    logger.info(f"Function completed succesfully!")
    return {
        "statusCode": 200,
        "body": [x.event_id for x in unique_payloads],
    }


def __process_record(
    payload: KinesisStreamPtlSchoolSignupRecord,
    context: LambdaContext,
    slack_client: SlackClient,
):
    logger.info(f"Starting payload {payload.event_id}")

    hubspot_payload = None

    try:
        s3_client.write(
            s3_path=s3_client.construct_s3_path(
                event_id=payload.event_id,
                context=context,
                status=HTTPStatus.PROCESSING,
                timestamp=payload.event_timestamp,
            ),
            event_id=payload.event_id,
            event_payload=payload._json_data,
            status=HTTPStatus.PROCESSING,
        )

        logger.info(f"Getting required data from postgres")
        try:
            pg_client.connect()
            school_data = pg_client.get_school_data(payload.school_uuid)
        finally:
            pg_client.close()

        logger.info(f"Getting attribution data from mixpanel")
        attribution_data: MixpanelAttributionData = mixpanel_client.download_data(
            school_uuid=school_data.school_uuid,
            email=school_data.owner_email,
            slack_client=slack_client,
        )

        logger.info(f"Posting form to hubspot")
        hubspot_payload = HubspotPtlSchoolSignupFormPayload(
            firstname=school_data.owner_first_name,
            lastname=school_data.owner_last_name,
            email=school_data.owner_email,
            phone=school_data.phone,
            company=school_data.company,
            ftl_number_of_students=school_data.stated_student_count,
            ftl_program_type=FTLProgramTypeEnum(school_data.program_type.upper()),
            state=school_data.state.upper(),
            brightwheel_plan=school_data.brightwheel_plan,
            ptl_form_completed_date=payload.event_timestamp.date(),
            utm_source=attribution_data.utm_source if attribution_data else None,
            utm_medium=attribution_data.utm_medium if attribution_data else None,
            utm_campaign=attribution_data.utm_campaign if attribution_data else None,
            utm_content=attribution_data.utm_content if attribution_data else None,
            utm_term=attribution_data.utm_term if attribution_data else None,
        )
        hubspot_client.post_form(
            url=config.HS_PTL_SCHOOL_SIGNUP_FORM_ENDPOINT,
            payload=hubspot_payload,
        )

        logger.info(f"Writing to s3")
        s3_client.write(
            s3_path=s3_client.construct_s3_path(
                event_id=payload.event_id,
                context=context,
                status=HTTPStatus.OK,
                timestamp=payload.event_timestamp,
            ),
            event_id=payload.event_id,
            event_payload=payload._json_data,
            status=HTTPStatus.OK,
            hubspot_payload=hubspot_payload,
        )

        logger.info(f"Completed payload {payload.event_id}")

    except Exception as ex:
        logger.error(f"Error processing payload '{payload.event_id}': {ex}")
        s3_path = s3_client.construct_s3_path(
            event_id=payload.event_id,
            context=context,
            status=HTTPStatus.INTERNAL_SERVER_ERROR,
            timestamp=payload.event_timestamp,
        )
        s3_client.write(
            s3_path=s3_path,
            event_id=payload.event_id,
            event_payload=payload._json_data,
            status=HTTPStatus.INTERNAL_SERVER_ERROR,
            hubspot_payload=hubspot_payload,
            error_msg=str(ex),
        )
        logger.info(
            f"Error details written to 's3://{s3_client.s3_bucket}/{s3_path}' for '{payload.event_id}'"
        )
        raise

```